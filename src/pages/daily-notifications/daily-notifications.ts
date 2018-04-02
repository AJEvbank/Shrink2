import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, PopoverController, ViewController, LoadingController, AlertController, ToastController, Loading } from 'ionic-angular';

import { NotificationPopoverPage } from './notification-popover';

import { DailyNotificationsService } from '../../services/daily-notifications.service';

import { Notification } from '../../assets/models/notification.model';

@Component({
  selector: 'page-daily-notifications',
  templateUrl: 'daily-notifications.html',
})
export class DailyNotificationsPage implements OnInit {

  notificationList: Notification [];

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private dailyNotificationsService: DailyNotificationsService,
              private popoverController: PopoverController,
              private viewCtrl: ViewController,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController) {
  }

  ngOnInit() {
    if (window.location.hostname == "localhost") {
      if (this.dailyNotificationsService.isListLoaded() == false) {
        let loader = this.loadingCtrl.create();
        loader.present();
        console.log("Fetch the list here using browser service.");
        this.browserFetch(loader);
      }
      else {
        console.log("Do not fetch the list using browser service.");
        this.notificationList = this.dailyNotificationsService.loadList();
      }
    }
    else {
      if (this.dailyNotificationsService.isListLoaded() == false) {
        let loader = this.loadingCtrl.create();
        loader.present();
        console.log("Fetch the list here using device service.");
        this.deviceFetch(loader);
      }
      else {
        console.log("Do not fetch the list using device service.");
        this.notificationList = this.dailyNotificationsService.loadList();
      }
    }
  }

  private deleteItem(index: number) {
    console.log("delete " + index);
    this.dailyNotificationsService.removeItem(index);
    this.notificationList = this.dailyNotificationsService.loadList();
  }

  private viewNotes(clickEvent, notification: Notification) {
    let popover = this.popoverController.create(NotificationPopoverPage, {notification: notification});
    popover.present();
  }

  public refreshList() {
    console.log("Refreshing the list.");
    let loader = this.loadingCtrl.create();
    loader.present();
    if (window.location.hostname == "localhost") {
      this.browserFetch(loader);
    }
    else {
      this.deviceFetch(loader);
    }
  }

  public browserFetch(loader: Loading) {
    console.log("Use fetchListLocal().");
    this.dailyNotificationsService.fetchListLocal()
    .then(
      (response) => {
        loader.dismiss();
        if (response.statusCode == "SUCCESS") {
          console.log("In refreshList('SUCCESS'), response: " + JSON.stringify(response));
          this.notificationList = this.dailyNotificationsService.loadList();
        }
        else if (response.statusCode == "ERROR" || response.statusCode == "UNDEFINED") {
          console.log("In refreshList('" + response.statusCode + "'), response: " + JSON.stringify(response));
          let errorAlert = this.alertCtrl.create({title: 'Error',message: "Could not refresh the list. Please try again.",buttons: ['Dismiss']});
          errorAlert.present();
        }else if (response.statusCode == "EMPTY") {
          console.log("In refreshList('EMPTY'), response: " + JSON.stringify(response));
          this.notificationList = this.dailyNotificationsService.loadList();
        }
      }
    )
    .catch(
      (err) => {
        loader.dismiss();
        console.log("Caught error in refreshList: " + err.json() + " :=> " + JSON.stringify(err));
        let errorAlert = this.alertCtrl.create({title: 'Error',message: "Could not refresh the list. Please try again.",buttons: ['Dismiss']});
        errorAlert.present();
      }
    );
  }

  public deviceFetch(loader: Loading) {
    console.log("Use fetchListDevice().");
    loader.dismiss();
  }

}
