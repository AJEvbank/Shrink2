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
    // this.highRiskList = this.hrService.getList();
    if(this.highRiskList.length <= 0){
      // this.hrService.addItem(new ItemRecord("021130332021","Beets",true));
      // this.hrService.addItem(new ItemRecord("021130332022","Carrots",true));
      // this.hrService.addItem(new ItemRecord("021130332023","Yams",true));
    }
    // Fetch high-risk list from server here.
    // this.highRiskList.push(new ItemRecord("021130332021","Beets",true));
    // this.highRiskList.push(new ItemRecord("021130332022","Carrots",true));
    // this.highRiskList.push(new ItemRecord("021130332023","Yams",true));
  }

  private deleteFromList(index: number) {
    //this.highRiskList.splice(index,1);
    // this.hrService.removeItem(index);
    // this.highRiskList = this.hrService.getList();
  }
}
