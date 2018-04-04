import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController, AlertController, PopoverController, LoadingController } from 'ionic-angular';

import { ItemRecord } from '../../assets/models/item-record.model';
import { ToGetItem } from '../../assets/models/to-get-item.model';

import { EditItemRecordPage } from './edit-item-record/edit-item-record';
import { CreateNotificationPage } from './create-notification/create-notification';
import { MainPage } from '../main/main';
import { ShelfHelperAddQuantityPopover } from './shelf-helper_popover';
import { ThrowawayQuantityPricePopoverPage } from './throwaway_popover';

import { ShelfHelperService } from '../../services/shelf-helper.service';
import { HighRiskListService } from '../../services/high-risk-list.service';


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
              private hrService: HighRiskListService,
              private popoverCtrl: PopoverController,
              private loadingCtrl: LoadingController
              ) {
  }

  ngOnInit() {
    this.item = this.navParams.get('item');
    this.isCompleteItemRecord = this.navParams.get('saved');
    console.log("isCompleteItemRecord: " + this.isCompleteItemRecord + " : " + this.navParams.get('saved'));
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
      createNotificationModal.onDidDismiss(
        (data) => {
          if (data == "SUCCESS") {
            let toast = this.toastCtrl.create({
              message: 'Your notification was saved.',
              duration: 2000,
              position: 'bottom'
            });
            toast.present();
          }
          else if (data == "ERROR"){
            let toast = this.toastCtrl.create({
              message: 'There was a problem. Please try again.',
              duration: 2000,
              position: 'bottom'
            });
            toast.present();
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

  //Nick: This should work no problems, let me know if it breaks.
  ToggleHighRisk(toggle: boolean){
    if(this.isCompleteItemRecord == true){
      let loader = this.loadingCtrl.create({
        content: "Updating..."
      });
      loader.present();
      //Update the status
      this.hrService.ToggleHighRisk(this.item, toggle)
      .then((itemResponse) => {
        this.item = itemResponse;
        loader.dismiss();
      })
      .catch((err) => {
        console.log(err);
        loader.dismiss();
      });

    }
    else{
      //Item record not complete. Fix dat shit, user.
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
          // This is repetitive, but will be necessary later.
          if(data.response == "ERROR") {
            console.log("Error from server: " + JSON.stringify(data));
            let errorAlert = this.alertCtrl.create({title: 'Error',message: "Could not create throwaway record. Please try again.",buttons: ['Dismiss']});
            errorAlert.present();
          }
          else if(data.response == "CANCELLED"){
            console.log("Action cancelled: " + JSON.stringify(data));
          }
          else {
            let toast = this.toastCtrl.create({message: 'Throwaway record saved.',duration: 2000,position: 'bottom'});
            toast.present();
          }
        }
      );
    }
    else {
      let toast = this.toastCtrl.create({message: 'This record is not complete. Please complete all fields.',duration: 2000,position: 'middle'});
      toast.present();
    }
  }

  home() {
    //this.navCtrl.push(MainPage);
    this.navCtrl.pop();
  }

}
