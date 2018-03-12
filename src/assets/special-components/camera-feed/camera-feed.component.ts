import { Component, OnInit } from '@angular/core';

import { CameraPreview, CameraPreviewOptions } from '@ionic-native/camera-preview';


@Component({
  selector: 'camera-feed',
  templateUrl: 'camera-feed.component.html'
})
export class CameraFeed implements OnInit {

  cameraPreviewOpts: CameraPreviewOptions = {
    x: (window.screen.width)/6,
    y: (window.screen.width)/5,
    width: 4 * ((window.innerWidth)/6),
    height: (window.innerHeight)/2,
    camera: 'rear',
    tapPhoto: false,
    previewDrag: false,
    toBack: true,
    alpha: 1
  };

  constructor(private cameraFeed: CameraPreview) {

  }

  ngOnInit() {
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

  public stopCameraFeed() {
    this.cameraFeed.stopCamera();
  }

  ngOnDestroy() {
    this.stopCameraFeed();
  }


}
