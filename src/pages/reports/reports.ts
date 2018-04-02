import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { AWSCommBrowserService } from '../../services/AWSCommBrowser.service';

import { ReportSpecificationsPage } from './report-specifications/report-specifications';
import { ShrinkListPage } from './shrink-list/shrink-list';

@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html',
})
export class ReportsPage {
  reportSpecificationsPage = ReportSpecificationsPage;
  shrinkListPage = ShrinkListPage;
  //Report Types for data passing...
  RT_lossOverTime = 'Loss Over Time';
  RT_calendarView = 'Calendar View';
  RT_excelSpreadsheet = 'Excel Spreadsheet';

  constructor(private navCtrl: NavController,
              private loadingCtrl: LoadingController,
              private AWSCommBrowser: AWSCommBrowserService){}

  onClickShrinkList(){
    let loader = this.loadingCtrl.create({
      content: "Waiting...",
    });
    loader.present();
    if (window.location.hostname == "localhost") {
      this.AWSCommBrowser.AWSFetchShrinkList()
      .then((ret) => {
        this.navCtrl.push(ShrinkListPage, ret);
        loader.dismiss();
      })
      .catch((err) => {
        console.log(err);
        loader.dismiss();
      });
    }
    else {
      //this.scanItemAndroid();
    }



  }
}
