import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController, AlertController, PopoverController, LoadingController } from 'ionic-angular';

import { ItemRecord } from '../../assets/models/item-record.model';
import { ToGetItem } from '../../assets/models/to-get-item.model';
import { Throwaway } from '../../assets/models/throwaway.model';
import { ItemCollection } from '../../assets/models/item-collection.model';

import { EditItemRecordPage } from './edit-item-record/edit-item-record';
import { CreateNotificationPage } from './create-notification/create-notification';
import { MainPage } from '../main/main';
import { ShelfHelperAddQuantityPopover } from './shelf-helper_popover';
import { ThrowawayQuantityPricePopoverPage } from './throwaway_popover';

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
              private popoverCtrl: PopoverController,
              private loadingCtrl: LoadingController
              ) {
  }

  ngOnInit() {
    this.item = this.navParams.get('item');
    if (this.item.name == "(Add New Item Name Here)" || this.item.name == "EMPTY" || this.item.name == "WRONG_UPC") {
      this.isCompleteItemRecord = false;
    }
    this.shelfHelperService.fetchList();
  }

  editItem() {
    let editModal = this.modalCtrl.create(EditItemRecordPage, {item: this.item});
    editModal.present();
    editModal.onDidDismiss(
      (data) => {
        console.log("In editItem(): " + JSON.stringify(data));
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
          console.log("Checking data..." + JSON.stringify(data.item));
          console.log("Checking current item..." + JSON.stringify(this.item));
        }
      }
    );
  }

  createNotification() {
    console.log("createNotification()");
    if (this.isCompleteItemRecord == true) {
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

  addToHighRiskList(status: string) {
    console.log("addToHighRiskList(" + status + ")");
    if (this.isCompleteItemRecord == true) {
      let loader = this.loadingCtrl.create({
        content: "Waiting...",
        duration: 2000
      });
      loader.present();
      // Server logic here and pass in the item upc and the status.
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
    if (this.isCompleteItemRecord == true) {
      let getQuantity = this.popoverCtrl.create(ShelfHelperAddQuantityPopover, {item: this.item}, { enableBackdropDismiss: false});
      getQuantity.present();
      getQuantity.onDidDismiss(
        (data) => {
          if(data.quantity != "NO_Quantity") {
            this.shelfHelperService.addItem(new ToGetItem(this.item, data.quantity));
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
    if (this.isCompleteItemRecord == true) {
      let throwaway = this.popoverCtrl.create(ThrowawayQuantityPricePopoverPage, { item: this.item }, { enableBackdropDismiss: false });
      throwaway.present();
      throwaway.onDidDismiss(
        (data) => {
          let newThrowaway: Throwaway;
          // This is repetitive, but will be necessary later.
          if(data.quantity != "CANCELLED") {
            newThrowaway = new Throwaway(new ItemCollection(this.item,data.quantity,data.unitPrice), new Date());
            console.log("Created: " + JSON.stringify(newThrowaway));
            // Server logic here as soon as they've created the lambda function and url for it.
            if (window.location.hostname == "localhost") {
              console.log("Used AWSB service.");
              let loader = this.loadingCtrl.create({
                content: "Waiting...",
                duration: 2000
              });
              loader.present();
            }
            else {
              console.log("Used AWS service.");
              let loader = this.loadingCtrl.create({
                content: "Waiting...",
                duration: 2000
              });
              loader.present();
            }
          }
          else {
            newThrowaway = new Throwaway(new ItemCollection(this.item,1,data.unitPrice), new Date());
            console.log("Created odd object: " + JSON.stringify(newThrowaway));

          }
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

  home() {
    //this.navCtrl.push(MainPage);
    this.navCtrl.pop();
  }

}
