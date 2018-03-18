import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, PopoverController } from 'ionic-angular';
import 'rxjs/add/operator/toPromise';

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

          this.AWS.AWSgetupc(data)
          .then((item) => {
            loader.dismiss();
            if(item.upc.length == 12){
              this.navCtrl.push(ItemRecordPage,{item: item});
            } else if(item.upc == "ERROR"){
              console.log("I'm an ERROR!");
            }
          })
          .catch((err) => {
            loader.dismiss();
            console.log(err);
          });
        }
      );
    }
    else {
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
        if(item.name != " "){
          this.navCtrl.push(ItemRecordPage,{item: item});
        }
        else{
          //Stuff here
        }
      })
      .catch((err) => {
        loader.dismiss();
        console.log(JSON.stringify(err));
      })
      /*
      this.scanner.androidScan()
      .then((upc) => {
          if(upc.length == 12){
            this.AWS.AWSgetupc(upc)
            .then((item) => {
              loader.dismiss();
              if(item.name != " "){
                this.navCtrl.push(ItemRecordPage,{item: item});
              }
              else{
                //Stuff here
              }
            })
            .catch((err) => {
              loader.dismiss();
              console.log("Server stuff has errored!");
            });
            //
          } else if(upc == " "){
            loader.dismiss();
            console.log("Scanner has errored!");
          }
        }
      )
      .catch((err) => {
          loader.dismiss();
          console.log(err);
        }
      );
      */
    }
  }

}
