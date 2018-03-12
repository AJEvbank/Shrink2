import { Component } from '@angular/core';

import { CameraPreview, CameraPreviewOptions } from '@ionic-native/camera-preview';


@Component({
  selector: 'camera-feed',
  templateUrl: 'camera-feed.component.html'
})
export class CameraFeed {

  cameraPreviewOpts: CameraPreviewOptions = {
    x: 0,
    y: 0,
    width: window.screen.width,
    height: (window.screen.height)/3,
    camera: 'rear',
    tapPhoto: false,
    previewDrag: false,
    toBack: true,
    alpha: 1
  };
  
  constructor(private cameraFeed: CameraPreview) {
    this.cameraFeed.startCamera(this.cameraPreviewOpts)
    .then(
      (res) => {
        console.log(res)
      }
    )
    .catch(
        (err) => {
          console.log(err)
        }
      )
    }


}
