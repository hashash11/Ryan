import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageGeneratorService {

  private worker;
  private resolvers: {[id: number]: any } = {}
  private rejecters: {[id: number]: any } = {}
  private count = 0;

  constructor() { 
    this.worker = new Worker(new URL('./generator.worker', import.meta.url));
  }

  getImage(imagery: any, bounds: any): Promise<ImageBitmap> {
    const id = this.count++;

    const htmlCanvas = document.createElement('canvas');
    htmlCanvas.width = 120;
    htmlCanvas.height = 120;
    // @ts-ignore # this was removed from libdom because its "experimental" but is fully supported in chrome
    const offscreen = htmlCanvas.transferControlToOffscreen()

    this.worker.postMessage({
      "width": 125, 
      "height": 125,
      "id": id,
      "canvas": offscreen
    }, [offscreen]);
    
    var promise = new Promise<ImageBitmap>((resolve, reject) => {
      debugger
      // if(this.resolvers[id] > 0){
      this.resolvers[id] = resolve;      
      this.rejecters[id] = reject;
      // }
    })
    
    this.worker.onmessage = ({ data }) => {
      var task_id = data['id']
      debugger
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
}
