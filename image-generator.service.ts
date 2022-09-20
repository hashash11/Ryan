import { Injectable } from '@angular/core';
import { FeatureCollection, Polygon, Position } from '@turf/turf';
import { forkJoin, map, Observable } from 'rxjs';
import { TileCacheService } from '../tileserver-client/tile-cache.service';
import { TileRef } from '../tileserver-client/tile-ref';
import { TileserverClient } from '../tileserver-client/tileserver-client.service';
import { TileserverImage } from '../tileserver-client/tileserver-image';
import { ImageWorld } from '../photogrammetry/image-world';
import { MercatorTileRenderRequest, TileRenderInfo } from './mercator-tile-render-request';
import { TileserverTileRenderRequest } from './tileserver-tile-render-request';
import { Rectangle } from '../shapes/rectangle';
import { Point2D } from '../photogrammetry/warp';
import { ImageScale } from '../photogrammetry/image-scale';
import { Vector2 } from '@math.gl/core';

export interface GetImageOptions {
  mapTileWidth: number,
  mapTileHeight: number,
  minZoom: number
}

@Injectable({
  providedIn: 'root'
})
export class ImageGeneratorService {

  private worker;
  private resolvers: {[id: number]: any } = {}
  private rejecters: {[id: number]: any } = {}
  private count = 0;

  constructor(private tileServerClient: TileserverClient, private tileCache: TileCacheService) { 
    this.worker = new Worker(new URL('./generator.worker', import.meta.url));
  }

  getImage(imagery: FeatureCollection, mapTileBBox: Polygon, zoom: number, options: GetImageOptions): Promise<ImageBitmap> {
    const id = this.count++;
    const mapTileWidth = options.mapTileWidth;
    const mapTileHeight = options.mapTileHeight;
    var imageWorld = new ImageWorld(mapTileWidth, mapTileHeight, mapTileBBox);

    var promise = new Promise<ImageBitmap>((resolve, reject) => {
      this.resolvers[id] = resolve;      
      this.rejecters[id] = reject;
    })

    const htmlCanvas = document.createElement('canvas');
    htmlCanvas.width = mapTileWidth;
    htmlCanvas.height = mapTileHeight;
    // @ts-ignore # this was removed from libdom because its "experimental" but is fully supported in chrome
    const offscreen = htmlCanvas.transferControlToOffscreen()

    if(imagery.features.length == 0 || zoom < options.minZoom) {
      this.worker.postMessage({
        "width": mapTileWidth, 
        "height": mapTileHeight,
        "id": id,
        "draw": false,
        "canvas": offscreen
        }, 
        [offscreen])
    } else {

      // var img_url = 'assets/tiles/XVIEWCHALLENGE-00005/20180116034512/0/0/0/0.png'

      // the outer array is the observable for each tileserver-image, it resolves when we get the metadata back,
      // the inner array is the TileRef we will use to get the image data. So we must first wait out and combine the outer array, so that
      // we get a single list containing the observables for all tiles, then we download the  tile image data so we can create a single
      // render request that we send to the worker thread
      var tileRefsPerImageObs: Observable<TileRef[]>[] = []


      imagery.features.forEach(imageFeature => {
        var imageNameParts: string[] = imageFeature.properties!['name'].split(":");
        var collectionId = imageNameParts[0];
        var timestamp = imageNameParts[1];
        var imageBoundsInRequest = <Polygon> imageFeature.geometry
        
        tileRefsPerImageObs.push(TileserverImage.build(collectionId, timestamp, this.tileServerClient, this.tileCache).pipe(
          map((tileserverImage) => {
             var topTile = tileserverImage.getTopTile();
             var unconstrainedRset = imageWorld.getRset(tileserverImage.cameraModel, imageWorld.getGeodeticCenter(), zoom)
             var targetRset = Math.max(Math.min(Math.floor(unconstrainedRset), tileserverImage.getMaxRLevel()), 0)
             return tileserverImage.getTilesToRender(targetRset, topTile, imageWorld, imageBoundsInRequest)
           }),
         )
        )
      });

      // after each tileserver-image resolves its metadata
      var tilesToFetch: Observable<TileRef[]> = forkJoin(tileRefsPerImageObs).pipe(
        // combine the resultingtile requests[][] (theres one array of tiles per full image) into a single array
        map(tileRefsByImage => tileRefsByImage.reduce((prev, next) => prev.concat(next), [])))

      tilesToFetch.subscribe(
        tileRefs => {
          var tileRenderRequests = tileRefs.map(tileRef => {
            return tileRef.getBufferedTile().pipe(
              map(bufferedTile => {
                return <TileserverTileRenderRequest> {
                  tileRef: tileRef,
                  bufferedImage: bufferedTile
                }
              })
            )
          });
         forkJoin(tileRenderRequests).pipe(
          map(allRenderRequests => {
          var renderInfo: TileRenderInfo[] = [];
          var bufferSize = allRenderRequests.reduce((accum, next) => accum + next.bufferedImage.imageData.length, 0);
          // put all the image data into one giant buffer so we can transfer it to the worker
          var allImageData = new Uint8Array(bufferSize);
          var offset = 0;
          allRenderRequests.forEach(nextRequest => {
            renderInfo.push(
              this.getRenderDetails(nextRequest.tileRef, imageWorld, offset, nextRequest.bufferedImage.imageData.length)
            )
            allImageData.set(nextRequest.bufferedImage.imageData, offset);
            offset += nextRequest.bufferedImage.imageData.length
          });
          return <MercatorTileRenderRequest> {
            width: 512,
            height: 512,
            id: id,
            draw: true,
            canvas: offscreen,
            imageData: allImageData,
            tileRenderInfo: renderInfo
          }
        })
        // now that evertying is combined into a single request, render the request
        ).subscribe(request => this.worker.postMessage(request, [request.canvas, request.imageData.buffer]))

        }
      )
        }

    
    this.worker.onmessage = ({ data }) => {
      var task_id = data['id']
      if (data['success']) {
        this.resolvers[task_id](data['bitmap']);
      } else {
        this.rejecters[task_id](data['failure_message'])
      }
      delete this.resolvers[task_id]
      delete this.rejecters[task_id]
    };

    return promise;
  }

  getRenderDetails(tileRef: TileRef, imageWorld: ImageWorld, bufferOffset: number, bufferSize: number): TileRenderInfo {

    var coords: Position[] = tileRef.getImageSpaceBounds().coordinates[0]
    var z = -tileRef.rset;
    var vertices: number[] = [
      coords[3][0],    coords[3][1]+1, z,
      coords[0][0],    coords[0][1],   z,
      coords[2][0]+1,  coords[2][1]+1, z,
      coords[1][0]+1,  coords[1][1],   z
    ]

    var areaToRenderR0: Rectangle = tileRef.getR0RectInImageSpace();
    var offsetR0: Point2D = new Point2D(0, 0)

    var tileScale: ImageScale = ImageScale.forRset(tileRef.rset);
    var offsetThisRset: Point2D = tileScale.scaleDownToRset(offsetR0);

    var tileSize: Vector2 = new Vector2(tileRef.getWidth(), tileRef.getHeight());
    var tileOffsetThisRset: Vector2 = new Vector2(offsetThisRset.x, offsetThisRset.y);
    var minTexture: Vector2 = tileOffsetThisRset.divide(tileSize);

    // this vector class mutates the data you pass it so.. be careful
    tileOffsetThisRset = new Vector2(offsetThisRset.x, offsetThisRset.y);
    tileSize = new Vector2(tileRef.getWidth(), tileRef.getHeight());
    var tileDimR0 = new Point2D(areaToRenderR0.width, areaToRenderR0.height);
    var dimThisRset: Point2D = tileScale.scaleDownToRset(tileDimR0);
    var tileDimThisRset: Vector2 = new Vector2(dimThisRset.x, dimThisRset.y);
    var maxTexture: Vector2 = tileOffsetThisRset.add(tileDimThisRset).divide(tileSize);

    var textureQuad: number[] = [
      minTexture.x, maxTexture.y,
      minTexture.x, minTexture.y,
      maxTexture.x, maxTexture.y,
      maxTexture.x, minTexture.y
    ]

    var mvpMatrix = imageWorld.getWebGLImageMVPMatrix(tileRef.image);

    return {
      offset: bufferOffset,
      size: bufferSize,
      width: tileRef.getWidth(),
      height: tileRef.getHeight(),
      vertices: vertices,
      textureQuad: textureQuad,
      mvpMat: mvpMatrix
    }

  }
}
