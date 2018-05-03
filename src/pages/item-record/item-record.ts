import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController, AlertController, PopoverController, LoadingController, ViewController } from 'ionic-angular';

import { ItemRecord } from '../../assets/models/item-record.model';
import { ToGetItem } from '../../assets/models/to-get-item.model';

import { EditItemRecordPage } from './edit-item-record/edit-item-record';
import { CreateNotificationPage } from './create-notification/create-notification';
import { MainPage } from '../main/main';
import { ShelfHelperAddQuantityPopover } from './shelf-helper_popover';
import { ThrowawayQuantityPricePopoverPage } from './throwaway_popover';

import { ShelfHelperService } from '../../services/shelf-helper.service';
import { HighRiskListService } from '../../services/high-risk-list.service';

import { LogHandler } from '../../assets/helpers/LogHandler';


@Component({
  selector: 'page-item-record',
  templateUrl: 'item-record.html',
})
export class ItemRecordPage implements OnInit {

  private item: ItemRecord;
  //editItemRecordPage: EditItemRecordPage;
  private isCompleteItemRecord: boolean = true;
  private mainPage: MainPage;
  private createNotificationPage: CreateNotificationPage;
  private fromMain: boolean = false;

  private logger: LogHandler = new LogHandler("ItemRecordPage");

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private modalCtrl: ModalController,
              private toastCtrl: ToastController,
              private alertCtrl: AlertController,
              private shelfHelperService: ShelfHelperService,
              private hrService: HighRiskListService,
              private popoverCtrl: PopoverController,
              private loadingCtrl: LoadingController,
              private viewCtrl: ViewController
              ) {
  }

  ngOnInit() {
    this.item = this.navParams.get('item');
    this.fromMain = this.navParams.get('fromMain');
    this.isCompleteItemRecord = this.navParams.get('saved');
    //this.shelfHelperService.fetchList();
    this.viewCtrl.showBackButton(!this.fromMain);
  }

  private editItem() : void {
    let editModal = this.modalCtrl.create(EditItemRecordPage, {item: this.item});
    editModal.present();
    editModal.onDidDismiss(
      (data) => {
        this.logger.logCont(data,"editItem");
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
    return;
  }

  private createNotification() : void {
    if (this.isCompleteItemRecord == true) {
      let createNotificationModal = this.modalCtrl.create(CreateNotificationPage, {item: this.item});
      createNotificationModal.present();
      createNotificationModal.onDidDismiss(
        (data) => {
          this.logger.logCont(data,"createNotification");
          if (data == "SUCCESS") {
            let toast = this.toastCtrl.create({message: 'Your notification was saved.',duration: 2000,position: 'bottom'});
            toast.present();
          }
          else if (data == "ERROR" || data == "UNDEFINED"){
            let error = this.alertCtrl.create({title: 'Error',message: 'There was a problem. Please try again.',buttons: ['Dismiss']});
            error.present();
          }
        }
      );
    }
    else {
      let toast = this.toastCtrl.create({message: 'This record is not complete. Please complete all fields.',duration: 2000,position: 'middle'});
      toast.present();
    }
    return;
  }

  //Nick: This should work no problems, let me know if it breaks.

  private ToggleHighRisk(toggle: boolean) : void {
    if(this.isCompleteItemRecord == true){
      let loader = this.loadingCtrl.create({
        content: "Updating..."
      });
      loader.present();
      //Update the status
      this.hrService.ToggleHighRisk(this.item, toggle)
      .then(
        (itemResponse) => {
          this.logger.logCont(itemResponse,"ToggleHighRisk");
          if (itemResponse.message == "SUCCESS") {
            this.item = itemResponse.item;
            loader.dismiss();
          }
          else if (itemResponse.message == "ERROR") {
            loader.dismiss();
            let error = this.alertCtrl.create({title: "Error",message: "An error occurred. Please try again.",buttons:['Dismiss']});
            error.present();
          }
      })
      .catch((err) => {
        this.logger.logErr(err,"ToggleHighRisk");
        loader.dismiss();
        let error = this.alertCtrl.create({title: "Error",message: "An error occurred. Please try again.",buttons:['Dismiss']});
        error.present();
      });

    }
    else{
      //Item record not complete. Fix dat shit, user.
      let toast = this.toastCtrl.create({message: 'This record is not complete. Please complete all fields.',duration: 2000,position: 'middle'});
      toast.present();
    }
    return;
  }

  private addToShelfHelperList() : void {
    if (this.isCompleteItemRecord == true) {
      let getQuantity = this.popoverCtrl.create(ShelfHelperAddQuantityPopover, {item: this.item}, { enableBackdropDismiss: false});
      getQuantity.present();
      getQuantity.onDidDismiss(
        (data) => {
          this.logger.logCont(data,"addToShelfHelperList");
          if(data.quantity != "NO_Quantity") {
            this.shelfHelperService.addItem(new ToGetItem(this.item, data.quantity))
            .then(
              (data: string) => {
                let toast = this.toastCtrl.create({message: 'Updated Shelf Helper List.',duration: 3000,position: 'bottom'});
                toast.present();
              }
            )
            .catch(
              (err) => {
                this.logger.logErr(err,"addToShelfHelperList");
                let error = this.alertCtrl.create({title: 'Error',message:'An error occurred. Please try again.',buttons:['Dismiss']});
                error.present();
              }
            );
          }
        }
      );
    }
    else {
      let toast = this.toastCtrl.create({message: 'This record is not complete. Please complete all fields.',duration: 2000,position: 'middle'});
      toast.present();
    }
    return;
  }

  private throwaway() : void {
    if (this.isCompleteItemRecord == true) {
      let throwaway = this.popoverCtrl.create(ThrowawayQuantityPricePopoverPage, { item: this.item }, { enableBackdropDismiss: false });
      throwaway.present();
      throwaway.onDidDismiss(
        (data) => {
          this.logger.logCont(data,"throwaway");
          // This is repetitive, but will be necessary later.
          if(data.response == "ERROR") {
            let errorAlert = this.alertCtrl.create({title: 'Error',message: "Could not create throwaway record. Please try again.",buttons: ['Dismiss']});
            errorAlert.present();
          }
          else if(data.response == "CANCELLED"){
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
    return;
  }

  private home() : void {
    //this.navCtrl.push(MainPage);
    let lastIndex = this.navCtrl.indexOf(this.navCtrl.last());
    let difference = lastIndex - 2;
    this.navCtrl.remove(2,difference);
    this.navCtrl.pop();
    return;
  }

}
