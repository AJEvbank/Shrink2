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


  constructor(private navCtrl: NavController,
              private scanner: ScannerService,
              private loadingCtrl: LoadingController,
              private AWS: AWSCommService,
              private AWSB: AWSCommBrowserService,
              private popoverController: PopoverController,
              private alertCtrl: AlertController) {
      this.dummyFunctionCalls();
  }

  private dummyFunctionCalls() {
    this.scanItem(false);
    this.getItemByUPC(false);
  }


  private scanItem(clear: boolean) {
    if (clear == false) { return; }
    if (window.location.hostname == "localhost") {
      this.scanItemBrowser();
    }
    else {
      this.scanItemAndroid();
    }
  }

  private scanItemBrowser(){
    let pop = this.popoverController.create(GetUPCPopover, {}, { enableBackdropDismiss: false });
    pop.present();
    pop.onDidDismiss(
      (upc) => {
        console.log(upc);
        if (upc != "NO_UPC")
        {
          let loader = this.loadingCtrl.create();
          loader.present();
          this.AWSB.AWSgetupc(upc)
          .then(
            (item: ItemRecord) => {
              loader.dismiss();
              console.log("item: " + JSON.stringify(item));
              if(item.name == " ") {
                console.log("NewRecord Triggered");
                let newEmptyItem = new ItemRecord(item.upc,"(Add New Item Name Here)");
                this.navCtrl.push(ItemRecordPage,{item: newEmptyItem, saved: false});
              } else {
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

  private scanItemAndroid(){
    let loader = this.loadingCtrl.create();
    loader.present();
    this.scanner.androidScan()
    .then((upc) => {
      console.log("Successfully got a upc: " + upc);
      return this.AWS.AWSgetupc(upc);
    })
    .then((item) => {
      console.log("Successfully got an ItemRecord: " + JSON.stringify(item));
      loader.dismiss();
      if(item.name == " "){
        console.log("An error occurred in record retrieval!");
        let errAlert = this.alertCtrl.create({title: 'Error',message: "An error occurred. Please try again.",buttons: ['Dismiss']});
        errAlert.present();
      } else if(item.name == "EMPTY") {
        let newEmptyItem = new ItemRecord(item.upc,"(Add New Item Name Here)");
        this.navCtrl.push(ItemRecordPage,{item: newEmptyItem, saved: false});
      } else {
        this.navCtrl.push(ItemRecordPage,{item: item, saved: true});
      }
    })
    .catch((err) => {
      loader.dismiss();
      console.log(JSON.stringify(err));
      let errAlert = this.alertCtrl.create({title: 'Error',message: "An error occurred. Please try again.",buttons: ['Dismiss']});
      errAlert.present();
    })
  }

  private getItemByUPC(clear: boolean) {
    if (clear == false) { return; }
    if (window.location.hostname == "localhost") {
      this.scanItemBrowser();
    }
    else {
      console.log("getItemByUPC()");
      let pop = this.popoverController.create(GetUPCPopover, {}, { enableBackdropDismiss: false });
      pop.present();
      pop.onDidDismiss(
        (data) => {
          console.log("onDidDismiss " + JSON.stringify(data));
          if (data != "NO_UPC") {
            let loader = this.loadingCtrl.create();
            loader.present();
            this.AWS.AWSgetupc(data)
            .then((item) => {
              loader.dismiss();
              if(item.upc.length != 12) {
                console.log("An error occurred in record retrieval!");
                let errAlert = this.alertCtrl.create({title: 'Error',message: "An error occurred. Please try again.",buttons: ['Dismiss']});
                errAlert.present();
              } else if(item.name == " ") {
                let newEmptyItem = new ItemRecord(item.upc,"(Add New Item Name Here)");
                this.navCtrl.push(ItemRecordPage,{item: newEmptyItem});
              } else {
                this.navCtrl.push(ItemRecordPage,{item: item});
              }
            })
            .catch((err) => {
              loader.dismiss();
              console.log("This is the error caught from AWS.AWSgetupc: " + err);
            });
          }
          else {
            console.log("Cancelled with: " + data.upc);
          }
        }
      );
    }
  }

}
