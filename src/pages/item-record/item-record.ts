import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController } from 'ionic-angular';

import { ItemRecord } from '../../assets/models/item-record.model';

import { EditItemRecordPage } from './edit-item-record/edit-item-record';
import { MainPage } from '../main/main';

@Component({
  selector: 'page-item-record',
  templateUrl: 'item-record.html',
})
export class ItemRecordPage implements OnInit {

  item: ItemRecord;
  //editItemRecordPage: EditItemRecordPage;
  isCompleteItemRecord: boolean = true;
  mainPage: MainPage;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private modalCtrl: ModalController,
              private toastCtrl: ToastController) {
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
        this.isCompleteItemRecord = true;
      }
    );
  }

  createNotification() {
    console.log("createNotification()");
    if (this.isCompleteItemRecord) {

    }
    else {
      let toast = this.toastCtrl.create({
        message: 'This record is not complete. Please complete all fields.',
        duration: 2000,
        position: 'middle'
      });
      toast.present();
    }
  }

  addToHighRiskList() {
    console.log("addToHighRiskList()");
  }

  addToShelfHelperList() {
    console.log("addToShelfHelperList()");
  }

  throwaway() {
    console.log("throwaway()");
  }

  home() {
    this.navCtrl.push(MainPage);
  }

}
