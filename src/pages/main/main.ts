import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CameraPreview, CameraPreviewOptions } from '@ionic-native/camera-preview';

import { ItemRecordPage } from '../item-record/item-record';
import { DailyNotificationsPage } from '../daily-notifications/daily-notifications';
import { HighRiskListPage } from '../high-risk-list/high-risk-list';
import { ShelfHelperPage } from '../shelf-helper/shelf-helper';
import { ReportsPage } from '../reports/reports';

import { CameraFeed } from '../../assets/special-components/camera-feed/camera-feed.component';



@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {

  camFeed: CameraFeed;

  itemRecordPage = ItemRecordPage;
  dailyNotificationsPage = DailyNotificationsPage;
  highRiskList = HighRiskListPage;
  shelfHelperPage = ShelfHelperPage;
  reportsPage = ReportsPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log(window.screen.height);
    console.log(window.screen.width);
    this.camFeed = new CameraFeed(new CameraPreview());
  }



  ionViewWillDisappear() {
    this.camFeed.stopCameraFeed();
  }

}
