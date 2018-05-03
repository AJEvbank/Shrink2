import { Component, OnInit } from '@angular/core';
import { PopoverController, LoadingController, AlertController, ToastController, ModalController } from 'ionic-angular';

import { NotificationPopoverPage } from './notification-popover';
import { SearchByDateRangePopover } from './searchByDateRange';

import { DailyNotificationsService } from '../../services/daily-notifications.service';

import { Notification } from '../../assets/models/notification.model';

import { EditNotificationPage } from './edit-notification/edit-notification';

import { LogHandler } from '../../assets/helpers/LogHandler';

@Component({
  selector: 'page-daily-notifications',
  templateUrl: 'daily-notifications.html',
})
export class DailyNotificationsPage implements OnInit {

  private notificationList: Notification [] = [];
  private noNotifications: boolean = false;
  private searchedByRange: boolean = false;

  private logger: LogHandler = new LogHandler("DailyNotificationsPage");

  constructor(private dailyNotificationsService: DailyNotificationsService,
              private popoverCtrl: PopoverController,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private modalCtrl: ModalController) {
      this.dummyFunction();
  }

  private dummyFunction() {
    this.deleteItem(-2);
    this.viewNotes(null,null);
    this.searchByDate(false);
    this.editItem(null, -1);
    this.clearList(false);
  }

  ngOnInit() {
    if (this.dailyNotificationsService.isListLoaded() == false){
      this.FetchList();
    }
    else{
      this.notificationList = this.dailyNotificationsService.GetList();
    }
  }

  private deleteItem(index: number) : void {
    if (index < 0) { return; }
    this.dailyNotificationsService.removeItem(index);
    this.notificationList = this.dailyNotificationsService.GetList();
    return;
  }

  private viewNotes(clickEvent=null, notification: Notification = null) : void {
    if (clickEvent == null) { return; }
    let popover = this.popoverCtrl.create(NotificationPopoverPage, {notification: notification}, { enableBackdropDismiss: false});
    popover.present();
    popover.onDidDismiss(
      (data) => {
        this.logger.logCont(data,"viewNotes");
        if (data.Id != null) {
          this.dailyNotificationsService.permanentDeleteNotification(data.Id)
          .then(
            (message) => {
              this.logger.logCont(message,"viewNotes");
              if(message == undefined || message == "ERROR") {
                let errorAlert = this.alertCtrl.create({title: 'Error',message: "An error occurred. Please try again.",buttons: ['Dismiss']});
                errorAlert.present();
              }
              else if (message == "SUCCESS") {
                let toast = this.toastCtrl.create({message: "Notification has been deleted. Refresh list to view changes.",duration: 4000});
                toast.present();
              }
            }
          )
          .catch(
            (err) => {
              this.logger.logErr(err,"viewNotes");
              let errorAlert = this.alertCtrl.create({title: 'Error',message: "An error occurred. Please try again.",buttons: ['Dismiss']});
              errorAlert.present();
            }
          );
        }
      }
    );
    return;
  }

  public refreshList() : void {
    this.FetchList();
    return;
  }

  public FetchList() : void {
    //Setup loader...

    let loader = this.loadingCtrl.create({content: "Updating..."});
    loader.present();
    //Make async request to AWS
    this.dailyNotificationsService.FetchList()
    .then(
      (message: string) => {
        this.logger.logCont(message,"FetchList");
        //It works! Update local list with service list!
        if (message == "SUCCESS") {
          this.notificationList = this.dailyNotificationsService.GetList();
          this.noNotifications = this.notificationList.length == 0;
          this.searchedByRange = false;
          loader.dismiss();
        }
        else if (message == "ERROR"){
          loader.dismiss();
          let errorAlert = this.alertCtrl.create({title: 'Error',message: "Could not fetch the list. Use Refresh button to retry.",buttons: ['Dismiss']});
          errorAlert.present();
        }

    })
    .catch((err) => {
      this.logger.logErr(err,"FetchList");
      //Uh-oh! Print the error!
      let errorAlert = this.alertCtrl.create({title: 'Error',message: "Could not fetch the list. Use Refresh.",buttons: ['Dismiss']});
      errorAlert.present();
      loader.dismiss();
    });
    return;
  }

  private searchByDate(clear: boolean) : void {
    if (clear == false) { return; }
    let search = this.popoverCtrl.create(SearchByDateRangePopover, {}, { enableBackdropDismiss: false});
    search.present();
    let loader = this.loadingCtrl.create();
    search.onDidDismiss(
      (data) => {
        this.logger.logCont(data,"searchByDate");
        loader.dismiss();
        if (data.cancelled == false) {
          this.searchedByRange = true;
          this.dailyNotificationsService.fetchDateRangeNotifications(data.from,data.to)
          .then(
            (message) => {
              this.logger.logCont(message,"searchByDate");
              if(message == "ERROR") {
                let error = this.alertCtrl.create({title: 'Error',message: "Could not fetch the list. Please try again.",buttons: ['Dismiss']});
                error.present();
              }
              else {
                this.noNotifications = (this.dailyNotificationsService.getListLength() == 0) ? true : false;
                if (this.dailyNotificationsService.getListLength() == 0) {
                  let alert = this.alertCtrl.create({message:"No notifications in the specified time period.",buttons:['Dismiss']});
                  alert.present();
                }
                this.notificationList = this.dailyNotificationsService.GetList();
              }
            }
          )
          .catch(
            (err) => {
              this.logger.logErr(err,"searchByDate");
              let error = this.alertCtrl.create({title: 'Error',message: "Could not fetch the list. Please try again.",buttons: ['Dismiss']});
              error.present();
            }
          );
        }
        else {
          loader.dismiss();
        }
      }
    );
    return;
  }

  private editItem(notification: Notification, index: number) : void {
    if (index < 0) return;
    let editPage = this.modalCtrl.create(EditNotificationPage, { notification: notification });
    editPage.present()
    .then(
      (data) => {
        this.logger.logCont(data,"editItem");
      }
    )
    .catch(
      (err) => {
        this.logger.logErr(err,"editItem");
      }
    );
    editPage.onDidDismiss(
      (data) => {
        this.logger.logCont(data,"editItem");
        if(data == "ERROR") {
          let error = this.alertCtrl.create({title:"Error",message:"There was an error. Please try again.",buttons:['Dismiss']});
          error.present();
        }
        else if (data != "CANCELLED"){
          let toast = this.toastCtrl.create({message:"Record successfully saved.",duration:3000});
          toast.present();
        }
      }
    )
    return;
  }

  private clearList(clear: boolean) : void {
    if (clear == false) return;
    this.notificationList = [];
    return;
  }

}
