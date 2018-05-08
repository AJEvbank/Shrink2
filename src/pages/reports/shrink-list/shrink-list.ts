import { Component, OnInit } from '@angular/core';
import { NavParams, LoadingController, AlertController } from 'ionic-angular';

import { Throwaway } from '../../../assets/models/throwaway.model';
import { ItemRecord } from '../../../assets/models/item-record.model';
import { ShrinkAggregate } from '../../../assets/models/shrink-agreggate.model';

import { HighRiskListService } from '../../../services/high-risk-list.service';


@Component({
  selector: 'page-shrink-list',
  templateUrl: 'shrink-list.html',
})
export class ShrinkListPage implements OnInit {
  private throwawayList : Throwaway[];
  private shrinkList: ShrinkAggregate[];
  private shrinkListEmpty = false;

  constructor(private navParams: NavParams,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private hrService: HighRiskListService) {}

  ngOnInit(){
    this.shrinkList = this.navParams.data as ShrinkAggregate[];
    console.log(this.shrinkList);
    this.shrinkList.sort((a, b) => {
      if(a.shrink > b.shrink){
        return -1;
      }
      else if(a.shrink < b.shrink){
        return 1;
      }
      else{
        return 0;
      }
    })
    this.shrinkListEmpty = this.shrinkList.length == 0;
  }

  onToggleHighRisk(index: number, toggle: boolean){
    //Setup loader...
    let loader = this.loadingCtrl.create({
      content: "Updating item..."
    });
    loader.present();

    let item = this.shrinkList[index];
    this.hrService.ToggleHighRisk(new ItemRecord(item.upc, item.name, item.highRisk), toggle)
    .then((newItem) => {
      item.highRisk = newItem.item.isHighRisk;
      //this.shrinkList[index] = item;
      loader.dismiss();
    })
    .catch((err) => {
      console.log(err);
      let errorAlert = this.alertCtrl.create({title: 'Error', message: "Could not set to high risk. Error has been printed.", buttons: ['Dismiss']});
      errorAlert.present();
      loader.dismiss();
    })
  }

}
