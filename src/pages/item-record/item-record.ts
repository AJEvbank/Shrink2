import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { ItemRecord } from '../../assets/models/item-record.model';

import { EditItemRecordPage } from './edit-item-record/edit-item-record';

@Component({
  selector: 'page-item-record',
  templateUrl: 'item-record.html',
})
export class ItemRecordPage implements OnInit {

  item: ItemRecord;
  //editItemRecordPage: EditItemRecordPage;
  isCompleteItemRecord: boolean = true;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private modalCtrl: ModalController) {
  }

  ngOnInit() {
    this.item = this.navParams.get('item');
    console.log(this.item);
    if (this.item.name == "") {
      this.isCompleteItemRecord = false;
    }
  }

  editItem() {
    let editModal = this.modalCtrl.create(EditItemRecordPage, {item: this.item});
    editModal.present();
    editModal.onDidDismiss(
      (data) => {
        this.item = data;
      }
    );
  }

}
