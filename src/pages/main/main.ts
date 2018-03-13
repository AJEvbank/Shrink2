import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { ScannerService } from '../../services/scanner.service';
import { ItemRecord } from '../../assets/models/item-record.model';

import { ItemRecordPage } from '../item-record/item-record';
import { DailyNotificationsPage } from '../daily-notifications/daily-notifications';
import { HighRiskListPage } from '../high-risk-list/high-risk-list';
import { ShelfHelperPage } from '../shelf-helper/shelf-helper';
import { ReportsPage } from '../reports/reports';

@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {

  itemRecordPage = ItemRecordPage;
  dailyNotificationsPage = DailyNotificationsPage;
  highRiskList = HighRiskListPage;
  shelfHelperPage = ShelfHelperPage;
  reportsPage = ReportsPage;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private scanner: ScannerService,
              private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');
  }

  scanItem() {
    if (window.location.hostname == "localhost") {
      let item = new ItemRecord("000000000000","",0,false);
      this.navCtrl.push(ItemRecordPage,{item: item});
    }
    else {
      let loader = this.loadingCtrl.create({
      });
      loader.present();
      this.scanner.androidScan()
      .then(
        (item) => {
          loader.dismiss();
          this.navCtrl.push(ItemRecordPage,{item: item});
        }
      )
      .catch();
    }
  }

}
