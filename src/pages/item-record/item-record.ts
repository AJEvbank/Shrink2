import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController, AlertController, PopoverController, LoadingController, ViewController } from 'ionic-angular';

import { ItemRecord } from '../../assets/models/item-record.model';
import { ToGetItem } from '../../assets/models/to-get-item.model';

import { EditItemRecordPage } from './edit-item-record/edit-item-record';
import { CreateNotificationPage } from './create-notification/create-notification';
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

  private isCompleteItemRecord: boolean = true;
  private fromMain: boolean = false;

  private logger: LogHandler = new LogHandler("ItemRecordPage");

  private fromUPCdatabasemessage: string = "Please verify and save item record.";

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
    this.logger.logCont(this.navParams.data,"ngOnInit");
    this.item = this.navParams.get('item');
    this.fromMain = this.navParams.get('fromMain');
    this.isCompleteItemRecord = this.navParams.get('saved');

    //this.shelfHelperService.fetchList();

    this.viewCtrl.showBackButton(!this.fromMain);
    this.dummyFunctionCalls();
  }

  private dummyFunctionCalls() : void {
    this.editItem(false);
    this.ToggleHighRisk(false,false);
    this.addToShelfHelperList(false);
    this.createNotification(false);
    this.throwaway(false);
    this.home(false);
  }

  private editItem(clear=true) : void {
    if (clear == false) return;
    let editModal = this.modalCtrl.create(EditItemRecordPage, {item: this.item});
    editModal.present();
    editModal.onDidDismiss(
      (data) => {
        this.logger.logCont(data,"editItem");
        this.item = data.item;
        if (data.ErrorCode == "http error") {
          let errorAlert = this.alertCtrl.create({title: 'Error',message: "The record could not be updated. Please try again.",buttons: ['Dismiss']});
          errorAlert.present();
        }
        else if (data.ErrorCode == "cancelled") {
          // Do nothing.
        }
        else {
          this.isCompleteItemRecord = true;
        }
      }
    );
    return;
  }

  private createNotification(clear=true) : void {
    if (clear == false) return;
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
      let toast = this.toastCtrl.create({message: this.fromUPCdatabasemessage,duration: 2000,position: 'middle'});
      toast.present();
    }
    return;
  }

  //Nick: This should work no problems, let me know if it breaks.

  private ToggleHighRisk(toggle: boolean, clear=true) : void {
    if (clear == false) return;
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
      let toast = this.toastCtrl.create({message: this.fromUPCdatabasemessage,duration: 2000,position: 'middle'});
      toast.present();
    }
    return;
  }

  private addToShelfHelperList(clear=true) : void {
    if (clear == false) return;
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
      let toast = this.toastCtrl.create({message: this.fromUPCdatabasemessage,duration: 2000,position: 'middle'});
      toast.present();
    }
    return;
  }

  private throwaway(clear=true) : void {
    if (clear == false) return;
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
      let toast = this.toastCtrl.create({message: this.fromUPCdatabasemessage,duration: 2000,position: 'middle'});
      toast.present();
    }
    return;
  }

  private home(clear=true) : void {
    if (clear == false) return;
    let lastIndex = this.navCtrl.indexOf(this.navCtrl.last());
    let difference = lastIndex - 2;
    this.navCtrl.remove(2,difference);
    this.navCtrl.pop();
    return;
  }

}
