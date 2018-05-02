import { Component, OnInit } from '@angular/core';
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
export class MainPage implements OnInit {

  itemRecordPage = ItemRecordPage;
  dailyNotificationsPage = DailyNotificationsPage;
  highRiskListPage = HighRiskListPage;
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
  }

  ngOnInit() {
    //this.navCtrl.setRoot(MainPage);
    this.dummyFunctionCalls();
    this.isLocalHost = (window.location.hostname == "localhost") ? true : false;
    this.AWSComm = (this.isLocalHost == true) ? this.AWSB : this.AWS;
  }

  private dummyFunctionCalls() { // This function is stupid, but it gets rid of a stupid warning on transpile.
    this.scanItem(false);
    this.getItemByUPC(false);
    this.prepareHighRiskList(false);
  }


  private getItemByUPC(clear: boolean) {
    if (clear == false) { return; }
    let pop = this.popoverController.create(GetUPCPopover, {}, { enableBackdropDismiss: false });
    pop.present();
    pop.onDidDismiss(
      (upc) => {
        if (upc != "NO_UPC") {
          let loader = this.loadingCtrl.create();
          loader.present();
          this.AWSComm.AWSgetupc(upc)
          .then(
            (item: ItemRecord) => {
              loader.dismiss();
              if(item.name == "EMPTY") {
                let newEmptyItem = new ItemRecord(item.upc,"(Add New Item Name Here)");
                this.navCtrl.push(ItemRecordPage,{item: newEmptyItem, saved: false, fromMain: true});
              }
              else if(item.name == "ERROR") {
                let errAlert = this.alertCtrl.create({title: 'Error',message: "An error occurred. Please try again.",buttons: ['Dismiss']});
                errAlert.present();
              }
              else {
                this.navCtrl.push(ItemRecordPage,{item: item, saved: true, fromMain: true});
              }
          })
          .catch((err) => {
            loader.dismiss();
            let errAlert = this.alertCtrl.create({title: 'Error',message: "An error occurred. Please try again.",buttons: ['Dismiss']});
            errAlert.present();
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
      loader.present();
      return this.AWSComm.AWSgetupc(upc);
    })
    .then((item) => {
      loader.dismiss();
      if(item.name == "ERROR"){
        let errAlert = this.alertCtrl.create({title: 'Error',message: "An error occurred. Please try again.",buttons: ['Dismiss']});
        errAlert.present();
      } else if(item.name == "EMPTY") {
        let newEmptyItem = new ItemRecord(item.upc,"(Add New Item Name Here)");
        this.navCtrl.push(ItemRecordPage,{item: newEmptyItem, saved: false, fromMain: true});
      } else {
        this.navCtrl.push(ItemRecordPage,{item: item, saved: true, fromMain: true});
      }
      return;
    })
    .catch((err) => {
      loader.dismiss();
      let errAlert = this.alertCtrl.create({title: 'Error',message: "An error occurred. Please try again.",buttons: ['Dismiss']});
      errAlert.present();
      return;
    })
  }

  private prepareHighRiskList(clear: boolean) {
    if (clear == true)
    this.navCtrl.push(this.highRiskListPage);
  }
}
