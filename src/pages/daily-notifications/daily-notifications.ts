import { Component, OnInit } from '@angular/core';
import { PopoverController, LoadingController, AlertController, ToastController, ModalController } from 'ionic-angular';

import { NotificationPopoverPage } from './notification-popover';

import { DailyNotificationsService } from '../../services/daily-notifications.service';

import { Notification } from '../../assets/models/notification.model';

import { EditNotificationPage } from './edit-notification/edit-notification';

@Component({
  selector: 'page-daily-notifications',
  templateUrl: 'daily-notifications.html',
})
export class DailyNotificationsPage implements OnInit {

  notificationList: Notification [] = [];
  noNotifications: boolean = false;

  constructor(private dailyNotificationsService: DailyNotificationsService,
              private popoverController: PopoverController,
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
  }

  ngOnInit() {
    if (this.dailyNotificationsService.isListLoaded() == false){
      this.FetchList();
    }
    else{
      this.notificationList = this.dailyNotificationsService.GetList();
    }
  }

  private deleteItem(index: number) {
    if (index < 0) { return; }
    console.log("delete " + index);
    this.dailyNotificationsService.removeItem(index);
    this.notificationList = this.dailyNotificationsService.GetList();
    return;
  }

  private viewNotes(clickEvent=null, notification: Notification = null) {
    if (clickEvent == null) { return; }
    let popover = this.popoverController.create(NotificationPopoverPage, {notification: notification});
    popover.present();
    popover.onDidDismiss(
      (data) => {
        if (data.Id != null) {
          console.log("Delete notification with Id: " + data.Id);
          this.dailyNotificationsService.permanentDeleteNotification(data.Id)
          .then(
            (message) => {
              console.log("message in onDidDismiss(): " + message);
              if(message == undefined || message == "ERRORS" || message == "ERRORING" || message == "ERRORED") {
                let errorAlert = this.alertCtrl.create({title: 'Error',message: "An error occurred. Please try again.",buttons: ['Dismiss']});
                errorAlert.present();
              }
              else if (message == "SUCCESS") {
                let toast = this.toastCtrl.create({message: "Notification has been deleted.",duration: 2000});
                toast.present();
              }
            }
          )
          .catch(
            (err) => {
              console.log("Error caught in viewNotes() delete function: " + err.json() + " :=> " + JSON.stringify(err));
              let errorAlert = this.alertCtrl.create({title: 'Error',message: "An error occurred. Please try again.",buttons: ['Dismiss']});
              errorAlert.present();
            }
          );
        }
      }
    );
    return;
  }

  public refreshList() {
    console.log("Refreshing the list.");
    this.FetchList();
  }

  public FetchList(){
    //Setup loader...
    console.log("Entered FetchList()");
    let loader = this.loadingCtrl.create({
      content: "Updating..."
    });
    loader.present();
    //Make async request to AWS
    this.dailyNotificationsService.FetchList()
    .then(
      () => {
        //It works! Update local list with service list!
        this.notificationList = this.dailyNotificationsService.GetList();
        console.log("Dismissed in then()");
        this.noNotifications = this.notificationList.length == 0;
        loader.dismiss();
    })
    .catch((err) => {
      //Uh-oh! Print the error!
      console.log(err);
      let errorAlert = this.alertCtrl.create({title: 'Error',message: "Could not fetch the list. Use Refresh.",buttons: ['Dismiss']});
      errorAlert.present();
      console.log("Dismissed in catch()");
      loader.dismiss();
    });
  }

  private searchByDate(clear: boolean) {
    if (clear == false) { return; }
    console.log("searchByDate()");
    return;
  }

  private editItem(notification: Notification, index: number) {
    if (index < 0) return;
    console.log("editItem():");
    console.log("Notification: " + JSON.stringify(notification));
    let editPage = this.modalCtrl.create(EditNotificationPage, { notification: notification });
    editPage.present();
    editPage.onDidDismiss(
      (data) => {
        
      }
    );
  }

}
