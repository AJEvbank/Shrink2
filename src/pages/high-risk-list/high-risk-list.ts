import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';

import { ItemRecord } from '../../assets/models/item-record.model';
import { HighRiskListService }  from '../../services/high-risk-list.service';

import { ItemRecordPage } from '../item-record/item-record';

@Component({
  selector: 'page-high-risk-list',
  templateUrl: 'high-risk-list.html',
})

export class HighRiskListPage implements OnInit {

  highRiskList: ItemRecord [] = [];
  emptyList: boolean = true;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private hrService: HighRiskListService,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController) {
  }

  ngOnInit() {
    if (this.hrService.isListLoaded() == false) {
      this.hrService.FetchList()
      .then(
        (message: string) => {
          if (message == "SUCCESS") {
            this.highRiskList = this.hrService.GetList();
            this.emptyList = false;
          }
          else if (message == "EMPTY") {
            this.highRiskList = [];
            this.emptyList = true;
          }
          else if (message == "ERROR") {
            let error = this.alertCtrl.create({title: "Error",message: "There was an error loading the list. Please use the refresh button.",buttons:['Dismiss']});
            error.present();
          }
        }
      )
      .catch(
        (err) => {
          console.log("Error caught in ngOnInit(): " + JSON.stringify(err) + " :=> " + err.json());
          let error = this.alertCtrl.create({title: "Error",message: "There was an error loading the list. Please use the refresh button.",buttons:['Dismiss']});
          error.present();
        }
      );
    }
  }

  private deleteFromList(index: number) {
    let alert = this.alertCtrl.create({title: "Warning",message:"This action will not remove the item from the High-Risk List. To remove item from the High-Risk List, use the right sliding option",buttons:['Dismiss']});
    alert.present();
    alert.onDidDismiss( () => { this.highRiskList.splice(index,1); });
  }

  private refreshList() {
    this.hrService.FetchList()
    .then(
      (message: string) => {
        console.log("message from HighRiskListService: " + message);
        if (message == "SUCCESS") {
          this.highRiskList = this.hrService.GetList();
          this.emptyList = false;
        }
        else if (message == "EMPTY") {
          this.highRiskList = [];
          this.emptyList = true;
        }
        else if (message == "ERROR") {
          let error = this.alertCtrl.create({title: "Error",message: "There was an error loading the list. Please use the refresh button.",buttons:['Dismiss']});
          error.present();
        }
      }
    )
    .catch(
      (err) => {
        console.log("Error caught in ngOnInit(): " + JSON.stringify(err) + " :=> " + err.json());
        let error = this.alertCtrl.create({title: "Error",message: "There was an error loading the list. Please use the refresh button.",buttons:['Dismiss']});
        error.present();
      }
    );
  }

  private viewItem(item, i) {
    console.log("viewItem(" + JSON.stringify(item) + ", " + i + ")");
    this.navCtrl.push(ItemRecordPage,{item: item, saved: true});
  }
}
