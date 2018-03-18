import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, PopoverController } from 'ionic-angular';

import { ScannerService } from '../../services/scanner.service';
import { ItemRecord } from '../../assets/models/item-record.model';

import { AWSCommService } from '../../services/AWSComm.service';

import { ItemRecordPage } from '../item-record/item-record';
import { DailyNotificationsPage } from '../daily-notifications/daily-notifications';
import { HighRiskListPage } from '../high-risk-list/high-risk-list';
import { ShelfHelperPage } from '../shelf-helper/shelf-helper';
import { ReportsPage } from '../reports/reports';

import { GetUPCPopover } from './getUPCpopover';

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
              private loadingCtrl: LoadingController,
              private AWS: AWSCommService,
              private popoverController: PopoverController) {
  }



  scanItem() {
    if (window.location.hostname == "localhost") {
      let upc: string;
      let pop = this.popoverController.create(GetUPCPopover);
      pop.present();
      pop.onDidDismiss(
        (data) => {
          let loader = this.loadingCtrl.create();
          loader.present();
          this.AWS.AWSgetupc(data).subscribe(
            (item) => {
              console.log(item);
              loader.dismiss();
              this.navCtrl.push(ItemRecordPage,{item: item});
            },
            (err) => {
              console.log(err);
            }
          )
        }
      );
    }
    else {
      let loader = this.loadingCtrl.create({
      });
      loader.present();
      this.scanner.androidScan()
      .then(
        (item) => {
          loader.dismiss();
          console.log(JSON.stringify(item));
          //console.log("UPC: " + item.upc + " Name: " + item.name + " Weight: " + item.weight);
          this.navCtrl.push(ItemRecordPage,{item: item});
        }
      )
      .catch();
    }
  }

}
