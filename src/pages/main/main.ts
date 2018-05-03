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

  private highRiskListButtonDisabled = false;

  private testDebug: string;

  private AWSComm: AWSCommService | AWSCommBrowserService;
  private isLocalHost: boolean;

  private logger: LogHandler = new LogHandler("MainPage");


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

  private dummyFunctionCalls() : void { // This function is stupid, but it gets rid of a stupid warning on transpile.
    this.scanItem(false);
    this.getItemByUPC(false);
    this.prepareHighRiskList(false);
    return;
  }

  // async scanItemAsync() : Promise<string> {
  //   return this.scanner.androidScan();
  // }


  private getItemByUPC(clear: boolean) : void {
    if (clear == false) { return; }
    let pop = this.popoverController.create(GetUPCPopover, {}, { enableBackdropDismiss: false });
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
              loader.dismiss();
              if(data.message == "EMPTY") {
                let newEmptyItem = new ItemRecord(data.item.upc,"(Add New Item Name Here)");
                this.navCtrl.push(ItemRecordPage,{item: newEmptyItem, saved: false, fromMain: true});
              }
              else if(data.message == "ERROR" || data.message == "UNDEFINED") {
                let errAlert = this.alertCtrl.create({title: 'Error',message: "An error occurred. Please try again.",buttons: ['Dismiss']});
                errAlert.present();
              }
              else {
                this.navCtrl.push(ItemRecordPage,{item: data.item, saved: true, fromMain: true});
              }
          })
          .catch((err) => {
            loader.dismiss();
            this.logger.logErr(err,"getItemByUPC");
            if(err.error != undefined && err.error.Error == "upcId was not found in DynamoDB or upcdatabase") {
              console.log("Case occurred.");
              let newEmptyItem = new ItemRecord(upc,"(Add New Item Name Here)");
              this.navCtrl.push(ItemRecordPage,{item: newEmptyItem, saved: false, fromMain: true});
            }
            else {
              let errAlert = this.alertCtrl.create({title: 'Error',message: "An error occurred. Please try again.",buttons: ['Dismiss']});
              errAlert.present();
            }
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
        this.logger.logCont(upc,"scanItem");
        loader.present();
        return this.AWSComm.AWSgetupc(upc);
      })
      .then(
        (data: {item: ItemRecord, message: string}) => {
          this.logger.logCont(data,"scanItem");
          loader.dismiss();
          if(data.message == "ERROR"){
            let errAlert = this.alertCtrl.create({title: 'Error',message: "An error occurred. Please try again.",buttons: ['Dismiss']});
            errAlert.present();
          }else if (data.message == "EMPTY") {
            let newEmptyItem = new ItemRecord(data.item.upc,"(Add New Item Name Here)");
            this.navCtrl.push(ItemRecordPage,{item: newEmptyItem, saved: false, fromMain: true});
          }else {
            this.navCtrl.push(ItemRecordPage,{item: data.item, saved: true, fromMain: true});
          }
      })
      .catch(
        (err) => {
          loader.dismiss();
          this.logger.logErr(err,"scanItem");
          let errAlert = this.alertCtrl.create({title: 'Error',message: "An error occurred. Please try again.",buttons: ['Dismiss']});
          errAlert.present();
        });
      return;
  }

  // private async scanItem(clear: boolean) {
  //   if (clear == false) { return; }
  //   let loader = this.loadingCtrl.create();
  //   let varUPC = await this.scanItemAsync();
  //   if (varUPC == "ERROR" || varUPC == "NO_UPC") {
  //     let errAlert = this.alertCtrl.create({title: 'Error',message: "An error occurred with the scanner. Please try again.",buttons: ['Dismiss']});
  //     errAlert.present();
  //   }
  //   else {
  //     this.AWSComm.AWSgetupc(varUPC)
  //     .then(
  //       (data: {item: ItemRecord, message: string}) => {
  //         this.logger.logCont(data,"scanItem");
  //         loader.dismiss();
  //         if(data.message == "ERROR"){
  //           let errAlert = this.alertCtrl.create({title: 'Error',message: "An error occurred. Please try again.",buttons: ['Dismiss']});
  //           errAlert.present();
  //         }else if (data.message == "EMPTY") {
  //           let newEmptyItem = new ItemRecord(data.item.upc,"(Add New Item Name Here)");
  //           this.navCtrl.push(ItemRecordPage,{item: newEmptyItem, saved: false, fromMain: true});
  //         }else {
  //           this.navCtrl.push(ItemRecordPage,{item: data.item, saved: true, fromMain: true});
  //         }
  //     })
  //     .catch(
  //       (err) => {
  //         loader.dismiss();
  //         this.logger.logErr(err,"scanItem");
  //         let errAlert = this.alertCtrl.create({title: 'Error',message: "An error occurred. Please try again.",buttons: ['Dismiss']});
  //         errAlert.present();
  //       });
  //   }

    // this.scanner.androidScan()
    // .then(
    //   (upc) => {
    //     this.logger.logCont(upc,"scanItem");
    //     if (upc == "ERROR") {
    //       let errAlert = this.alertCtrl.create({title: 'Error',message: "An error occurred. Please try again.",buttons: ['Dismiss']});
    //       errAlert.present();
    //     }
    //     this.logger.logCont(upc,"scanItem");
    //     loader.present();
    //     return this.AWSComm.AWSgetupc(upc)
    //     .then(
    //       (data: {item: ItemRecord, message: string}) => {
    //         this.logger.logCont(data,"scanItem");
    //         loader.dismiss();
    //         if(data.message == "ERROR"){
    //           let errAlert = this.alertCtrl.create({title: 'Error',message: "An error occurred. Please try again.",buttons: ['Dismiss']});
    //           errAlert.present();
    //         }else if (data.message == "EMPTY") {
    //           let newEmptyItem = new ItemRecord(data.item.upc,"(Add New Item Name Here)");
    //           this.navCtrl.push(ItemRecordPage,{item: newEmptyItem, saved: false, fromMain: true});
    //         }else {
    //           this.navCtrl.push(ItemRecordPage,{item: data.item, saved: true, fromMain: true});
    //         }
    //     })
    //     .catch(
    //       (err) => {
    //         loader.dismiss();
    //         this.logger.logErr(err,"scanItem");
    //         let errAlert = this.alertCtrl.create({title: 'Error',message: "An error occurred. Please try again.",buttons: ['Dismiss']});
    //         errAlert.present();
    //       });
    //   })
    //   .catch(
    //     (err) => {
    //       loader.dismiss();
    //       this.logger.logErr(err,"scanItem");
    //       let errAlert = this.alertCtrl.create({title: 'Error',message: "An error occurred with the scanner. Please try again.",buttons: ['Dismiss']});
    //       errAlert.present();
    //     }
    //   );
  //     return;
  // }

  private prepareHighRiskList(clear: boolean) : void {
    if (clear == true)
    this.navCtrl.push(this.highRiskListPage);
    return;
  }
}
