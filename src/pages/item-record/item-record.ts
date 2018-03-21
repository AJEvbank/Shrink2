import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController, AlertController, PopoverController } from 'ionic-angular';

import { ItemRecord } from '../../assets/models/item-record.model';
import { ToGetItem } from '../../assets/models/to-get-item.model';

import { EditItemRecordPage } from './edit-item-record/edit-item-record';
import { CreateNotificationPage } from './create-notification/create-notification';
import { MainPage } from '../main/main';
import { ShelfHelperAddQuantityPopover } from './shelf-helper_popover';

import { ShelfHelperService } from '../../services/shelf-helper.service';

@Component({
  selector: 'page-item-record',
  templateUrl: 'item-record.html',
})
export class ItemRecordPage implements OnInit {

  item: ItemRecord;
  //editItemRecordPage: EditItemRecordPage;
  isCompleteItemRecord: boolean = true;
  mainPage: MainPage;
  createNotificationPage: CreateNotificationPage;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private modalCtrl: ModalController,
              private toastCtrl: ToastController,
              private alertCtrl: AlertController,
              private shelfHelperService: ShelfHelperService,
              private popoverCtrl: PopoverController
              ) {
  }

  ngOnInit() {
    this.item = this.navParams.get('item');
    if (this.item.name == "") {
      this.isCompleteItemRecord = false;
    }
    this.shelfHelperService.fetchList();
  }

  editItem() {
    let editModal = this.modalCtrl.create(EditItemRecordPage, {item: this.item});
    editModal.present();
    editModal.onDidDismiss(
      (data) => {
        if (data.ErrorCode == "empty/wrong" || data.ErrorCode == "http error") {
          let errorAlert = this.alertCtrl.create({
            title: 'Error',
            message: "The record could not be updated. Please try again.",
            buttons: ['Dismiss']
          });
          errorAlert.present();
          this.item = data.item;
        } else {
          this.item = data.item;
          this.isCompleteItemRecord = true;
        }
      }
    );
  }

  createNotification() {
    console.log("createNotification()");
    if (this.isCompleteItemRecord) {
      let createNotificationModal = this.modalCtrl.create(CreateNotificationPage, {item: this.item});
      createNotificationModal.present();
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

  addToShelfHelperList() {
    console.log("addToShelfHelperList()");
    if (this.isCompleteItemRecord) {
      let getQuantity = this.popoverCtrl.create(ShelfHelperAddQuantityPopover, {item: this.item}, { enableBackdropDismiss: false});
      getQuantity.present();
      getQuantity.onDidDismiss(
        (data) => {
          if(data.quantity != "NO_Quantity") {
            this.shelfHelperService.addItem(new ToGetItem(this.item, 1));
          }
          console.log(this.shelfHelperService.loadList());
        }
      );
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

  throwaway() {
    console.log("throwaway()");
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

  home() {
    //this.navCtrl.push(MainPage);
    this.navCtrl.pop();
  }

}
