import { Component } from '@angular/core';
import { NavController, LoadingController, PopoverController, AlertController } from 'ionic-angular';

import { ScannerService } from '../../services/scanner.service';
import { ItemRecord } from '../../assets/models/item-record.model';

import { AWSCommService } from '../../services/AWSComm.service';
import { AWSCommBrowserService } from '../../services/AWSCommBrowser.service';


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

  highRiskListButtonDisabled = false;

  testDebug: string;

  AWSComm: AWSCommService | AWSCommBrowserService;
  isLocalHost: boolean;


  constructor(private navCtrl: NavController,
              private scanner: ScannerService,
              private loadingCtrl: LoadingController,
              private AWS: AWSCommService,
              private AWSB: AWSCommBrowserService,
              private popoverController: PopoverController,
              private alertCtrl: AlertController) {
      this.dummyFunctionCalls();
      this.isLocalHost = (window.location.hostname == "localhost") ? true : false;
      this.AWSComm = (this.isLocalHost == true) ? this.AWSB : this.AWS;
  }

  private dummyFunctionCalls() { // This function is stupid, but it gets rid of a stupid warning on transpile.
    this.scanItem(false);
    this.getItemByUPC(false);
  }


  private getItemByUPC(clear: boolean) {
    if (clear == false) { return; }
    let pop = this.popoverController.create(GetUPCPopover, {}, { enableBackdropDismiss: false });
    pop.present();
    pop.onDidDismiss(
      (upc) => {
        console.log(upc);
        if (upc != "NO_UPC") {
          let loader = this.loadingCtrl.create();
          loader.present();
          this.AWSComm.AWSgetupc(upc)
          .then(
            (item: ItemRecord) => {
              loader.dismiss();
              console.log("item: " + JSON.stringify(item));
              if(item.name == "EMPTY") {
                console.log("NewRecord Triggered");
                let newEmptyItem = new ItemRecord(item.upc,"(Add New Item Name Here)");
                this.navCtrl.push(ItemRecordPage,{item: newEmptyItem, saved: false});
              }
              else if(item.name == "ERROR") {
                console.log("Error on response.");
                let errAlert = this.alertCtrl.create({title: 'Error',message: "An error occurred. Please try again.",buttons: ['Dismiss']});
                errAlert.present();
              }
              else {
                console.log("else Triggered");
                this.navCtrl.push(ItemRecordPage,{item: item, saved: true});
              }
          })
          .catch((err) => {
            loader.dismiss();
            let errAlert = this.alertCtrl.create({title: 'Error',message: "An error occurred. Please try again.",buttons: ['Dismiss']});
            errAlert.present();
            console.log("This is the error: " + err);
          });
        }
      }
    );
  }

  private scanItem(clear: boolean) : void {
    if (clear == false) { return; }
    let loader = this.loadingCtrl.create();
    this.scanner.androidScan()
    .then((upc) => {
      console.log("Successfully got a upc: " + upc);
      loader.present();
      return this.AWSComm.AWSgetupc(upc);
    })
    .then((item) => {
      console.log("Successfully got an ItemRecord: " + JSON.stringify(item));
      loader.dismiss();
      if(item.name == "ERROR"){
        console.log("An error occurred in record retrieval!");
        let errAlert = this.alertCtrl.create({title: 'Error',message: "An error occurred. Please try again.",buttons: ['Dismiss']});
        errAlert.present();
      } else if(item.name == "EMPTY") {
        let newEmptyItem = new ItemRecord(item.upc,"(Add New Item Name Here)");
        this.navCtrl.push(ItemRecordPage,{item: newEmptyItem, saved: false});
      } else {
        this.navCtrl.push(ItemRecordPage,{item: item, saved: true});
      }
      return;
    })
    .catch((err) => {
      loader.dismiss();
      console.log(JSON.stringify(err));
      let errAlert = this.alertCtrl.create({title: 'Error',message: "An error occurred. Please try again.",buttons: ['Dismiss']});
      errAlert.present();
      return;
    })
  }

}
