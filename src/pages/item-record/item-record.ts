import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ItemRecord } from '../../assets/models/item-record.model';

@Component({
  selector: 'page-item-record',
  templateUrl: 'item-record.html',
})
export class ItemRecordPage implements OnInit {

  item: ItemRecord;

  constructor(private navCtrl: NavController,
              private navParams: NavParams) {
  }

  ngOnInit() {
    this.item = this.navParams.get('item');
    console.log(this.item);
  }

}
