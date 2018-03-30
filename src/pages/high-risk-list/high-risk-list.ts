import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ItemRecord } from '../../assets/models/item-record.model';
import { HighRiskListService }  from '../../services/high-risk-list.service';

@Component({
  selector: 'page-high-risk-list',
  templateUrl: 'high-risk-list.html',
})

export class HighRiskListPage implements OnInit {

  highRiskList: ItemRecord [] = [];

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private hrService: HighRiskListService) {
  }

  ngOnInit() {
    if(this.hrService.isListLoaded){
      this.highRiskList = this.hrService.getList();
    }
    else{
      this.waitOnList()
      .then((list) => {

      })
      .catch((err) => {
        console.log(err);
        
      });
    }
    // Fetch high-risk list from server here.
    // this.highRiskList.push(new ItemRecord("021130332021","Beets",true));
    // this.highRiskList.push(new ItemRecord("021130332022","Carrots",true));
    // this.highRiskList.push(new ItemRecord("021130332023","Yams",true));
  }

  private deleteFromList(upc: string, index: number) {
    this.highRiskList.splice(index,1);
  }

  private waitOnList() : Promise<ItemRecord[]> {
    return new Promise<ItemRecord[]>((resolve, reject) => {
      while(this.hrService.isListLoaded() == false){
        //Grr, busy waiting...
      }
      resolve(this.hrService.getList());
    });
  }

}
