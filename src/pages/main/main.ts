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

import { LogHandler } from '../../assets/helpers/LogHandler';

@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage implements OnInit {

  private dailyNotificationsPage = DailyNotificationsPage;
  private highRiskListPage = HighRiskListPage;
  private shelfHelperPage = ShelfHelperPage;
  private reportsPage = ReportsPage;

  private AWSComm: AWSCommService | AWSCommBrowserService;
  private isLocalHost: boolean;

  private logger: LogHandler = new LogHandler("MainPage");


  constructor(private navCtrl: NavController,
              private scanner: ScannerService,
              private loadingCtrl: LoadingController,
              private AWS: AWSCommService,
              private AWSB: AWSCommBrowserService,
              private popoverCtrl: PopoverController,
              private alertCtrl: AlertController) {
  }

  ngOnInit() {
    this.dummyFunctionCalls();
    this.isLocalHost = (window.location.hostname == "localhost") ? true : false;
    this.AWSComm = (this.isLocalHost == true) ? this.AWSB : this.AWS;
  }

  private dummyFunctionCalls() : void { // This function is stupid, but it gets rid of a stupid warning on transpile.
    this.scanItem(false);
    this.getItemByUPC(false);
    this.prepareHighRiskList(false);
    let tempA = this.reportsPage;
    let tempB = this.highRiskListPage;
    let tempC = this.dailyNotificationsPage;
    let tempD = this.shelfHelperPage;
    return;
  }

  private getItemByUPC(clear: boolean) : void {
    if (clear == false) { return; }
    let pop = this.popoverCtrl.create(GetUPCPopover, {}, { enableBackdropDismiss: false });
    pop.present();
    pop.onDidDismiss(
      (upc) => {
        this.logger.logCont(upc,"getItemByUPC");
        if (upc != "NO_UPC") {
          let loader = this.loadingCtrl.create();
          loader.present();
          this.AWSComm.AWSgetupc(upc)
          .then(
            (data: {item: ItemRecord, message: string}) => {
              this.logger.logCont(data,"getItemByUPC");
              if(data.message == "EMPTY" || data.message == "FOUND") {
                this.navCtrl.push(ItemRecordPage,{item: data.item, saved: false, fromMain: true});
              }
              else if(data.message == "ERROR" || data.message == "UNDEFINED") {
                let errAlert = this.alertCtrl.create({title: 'Error',message: "An error occurred. Please try again.",buttons: ['Dismiss']});
                errAlert.present();
              }
              else {
                this.navCtrl.push(ItemRecordPage,{item: data.item, saved: true, fromMain: true});
              }
              loader.dismiss();
          })
          .catch((err) => {
            this.logger.logErr(err,"getItemByUPC");
            let errAlert = this.alertCtrl.create({title: 'Error',message: "An error occurred. Please try again.",buttons: ['Dismiss']});
            errAlert.present();
            loader.dismiss();
          });
        }
      }
    );
    return;
  }

  private scanItem(clear: boolean) : void {
    if (clear == false) { return; }
    let loader = this.loadingCtrl.create();
    this.scanner.androidScan()
    .then(
      (upc) => {
        this.logger.logCont(upc,"scanItem");
        if (upc == "ERROR") {
          let errAlert = this.alertCtrl.create({title: 'Error',message: "An error occurred. Please try again.",buttons: ['Dismiss']});
          errAlert.present();
        }
        else if (upc == "NOT_UPC_A") {
          let errAlert = this.alertCtrl.create({title: 'Error',message: "The code is not UPC_A.",buttons: ['Dismiss']});
          errAlert.present();
        }
        loader.present();
        return this.AWSComm.AWSgetupc(upc);
      })
      .then(
        (data: {item: ItemRecord, message: string}) => {
          this.logger.logCont(data,"scanItem");
          if(data.message == "ERROR") {
            let errAlert = this.alertCtrl.create({title: 'Error',message: "An error occurred. Please try again.",buttons: ['Dismiss']});
            errAlert.present();
          }else if (data.message == "EMPTY" || data.message == "FOUND") {
            this.navCtrl.push(ItemRecordPage,{item: data.item, saved: false, fromMain: true});
          }else {
            this.navCtrl.push(ItemRecordPage,{item: data.item, saved: true, fromMain: true});
          }
          loader.dismiss();
      })
      .catch(
        (err) => {
          this.logger.logErr(err,"scanItem");
          let errAlert = this.alertCtrl.create({title: 'Error',message: "An error occurred. Please try again.",buttons: ['Dismiss']});
          errAlert.present();
          loader.dismiss();
      });
      return;
  }

  private prepareHighRiskList(clear: boolean) : void {
    if (clear == true)
    this.navCtrl.push(this.highRiskListPage);
    return;
  }
}
