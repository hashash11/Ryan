// @ts-nocheck
import { Directive, ElementRef, OnInit } from '@angular/core';
import {
  OpenStreetMapImageryProvider, Viewer, WebMapTileServiceImageryProvider,
  Rectangle, Request, WebMercatorTilingScheme, Math, Cartesian3
} from 'cesium';
import { GetImageOptions, ImageGeneratorService } from './imaging/image-generator.service';
import Catalog from './catalog/catalog';
import { bboxPolygon, Feature, polygon, Polygon, Properties } from '@turf/turf';

// https://cesium.com/blog/2018/03/12/cesium-and-angular/ for instructions on running cesium in an angular project
@Directive({
  selector: '[app-cesium]'
})
export class CesiumDirective implements OnInit {

  constructor(private imageGenerator: ImageGeneratorService, private el: ElementRef) { }

  ngOnInit(): void {

    // Init Catalog
    Catalog.getCatalog();

    // Use our in-house open street maps server
    var colorOSM = new OpenStreetMapImageryProvider({
      url: 'https://osm.leidoslabs.com/colors/',
      maximumLevel: 14
    });

    var outlinesOSM = new OpenStreetMapImageryProvider({
      url: 'https://osm.leidoslabs.com/outlines/',
      maximumLevel: 20
    });

    const viewer = new Viewer(this.el.nativeElement,
      {
        //Hide the base layer picker
        baseLayerPicker: false,
        // Default geocoder uses ion, so turn it off
        geocoder: false,
        //Use OpenStreetMaps
        imageryProvider: colorOSM,
      }
    );

    // Show FPS rates
    viewer.scene.debugShowFramesPerSecond = true;


    // Hide our implementation in a WMTS provider. Cesium requests a tile, we fulfill that request with a WebGL canvas and the tileserver
    class WebGLImageProvider extends WebMapTileServiceImageryProvider {

      // Object that can turn x,y,z of tiles into a latitude and longitude
      private tileConverter = new WebMercatorTilingScheme()

      constructor(mapTileWidth: number, mapTileHeight: number, private imageGenerator: ImageGeneratorService) {
        super({ tileWidth: mapTileWidth, tileHeight: mapTileHeight, url: '', layer: '', style: '', format: '', tileMatrixSetID: '' })
      }

      override requestImage(x: number, y: number, level: number, request?: Request): Promise<any> | undefined {
        var rectangle: Rectangle = this.tileConverter.tileXYToRectangle(x, y, level)
        var west: number = Math.toDegrees(rectangle.west)
        var south: number = Math.toDegrees(rectangle.south)
        var east: number = Math.toDegrees(rectangle.east)
        var north: number = Math.toDegrees(rectangle.north)

        const tileBboxPoly: Feature<Polygon, Properties> = bboxPolygon([west, south, east, north]);
        const collection = Catalog.intersectingImagesCollection(tileBboxPoly);

        const requestOptions: GetImageOptions = {
          mapTileWidth: this.tileWidth,
          mapTileHeight: this.tileHeight,
          minZoom: 10 // TODO this should be set on each image instead based on GSD
        }

        return this.imageGenerator.getImage(collection, tileBboxPoly.geometry, level, requestOptions)

      }
    }

    // We are not really using a WMTS server even though we extend it, we just like the way it requests tiles because its an easy format
    // to work with. This demo also hardcodes the layer/url so that you can see it all in one block, so we ignore all these constructor options
    const mapTileWidth = 512;
    const mapTileHeight = 512;
    const provider = new WebGLImageProvider(mapTileWidth, mapTileHeight, this.imageGenerator)


    // By default, cesium adds a layer on top of all the other layers. You can explicitly set the ordering as well though
    viewer.imageryLayers.addImageryProvider(provider);
    // viewer.imageryLayers.addImageryProvider(outlinesOSM);

    document.querySelectorAll('.goto').forEach(button => {
      // @ts-ignore
      button.onclick = (e) => {
        const buttonName = e.srcElement.name;
        let long = -71.6194599575724, lat = -33.045380158154806, height = 30000;

        if (buttonName === 'valparaiso') {
          long = -71.6194599575724;
          lat = -33.045380158154806;
        }
        else if (buttonName === 'sudan') {
          long = 37.2254651054371;
          lat = 19.611333225520593;
        }
        viewer.camera.setView({
          destination: Cartesian3.fromDegrees(long, lat, height)
        });
      }
    });

    document.querySelector('#goto-longlat').onclick = () => {
      const longValue = document.querySelector('#lat-input').value;
      const latValue = document.querySelector('#long-input').value;
      const height = 30000;
      
      

      viewer.camera.setView({
        destination: Cartesian3.fromDegrees(parseFloat(longValue), parseFloat(latValue), height)
      });
    }

  }

}
