import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');
  }

}
