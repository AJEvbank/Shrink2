import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ItemRecord } from '../../assets/models/item-record.model';

@Component({
  selector: 'page-high-risk-list',
  templateUrl: 'high-risk-list.html',
})

export class HighRiskListPage implements OnInit {

  highRiskList: ItemRecord [] = [];

  constructor(private navCtrl: NavController,
              private navParams: NavParams) {
  }

  ngOnInit() {
    // Fetch high-risk list from server here.
    this.highRiskList.push(new ItemRecord("021130332021","Beets",true));
    this.highRiskList.push(new ItemRecord("021130332022","Carrots",true));
    this.highRiskList.push(new ItemRecord("021130332023","Yams",true));
  }

  deleteFromList(upc: string, index: number) {
    this.highRiskList.splice(index,1);
  }

}
