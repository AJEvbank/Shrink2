import { Component, OnInit } from '@angular/core';
import { PopoverController, LoadingController, AlertController } from 'ionic-angular';

import { NotificationPopoverPage } from './notification-popover';

import { DailyNotificationsService } from '../../services/daily-notifications.service';

import { Notification } from '../../assets/models/notification.model';

@Component({
  selector: 'page-daily-notifications',
  templateUrl: 'daily-notifications.html',
})
export class DailyNotificationsPage implements OnInit {

  notificationList: Notification [] = [];

  constructor(private dailyNotificationsService: DailyNotificationsService,
              private popoverController: PopoverController,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController) {
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
    console.log("delete " + index);
    this.dailyNotificationsService.removeItem(index);
    this.notificationList = this.dailyNotificationsService.GetList();
  }

  private viewNotes(clickEvent, notification: Notification) {
    let popover = this.popoverController.create(NotificationPopoverPage, {notification: notification});
    popover.present();
  }

  public refreshList() {
    console.log("Refreshing the list.");
    this.FetchList();
  }

  public FetchList(){
    //Setup loader...
    let loader = this.loadingCtrl.create({
      content: "Updating..."
    });
    loader.present();
    //Make async request to AWS
    this.dailyNotificationsService.FetchList()
    .then(() => {
      //It works! Update local list with service list!
      this.notificationList = this.dailyNotificationsService.GetList();
      loader.dismiss();
    })
    .catch((err) => {
      //Uh-oh! Print the error!
      console.log(err);
      let errorAlert = this.alertCtrl.create({title: 'Error',
                                              message: "Could not fetch the list. Error has been printed.",
                                              buttons: ['Dismiss']});
      errorAlert.present();
      loader.dismiss();
    });
  }
}
