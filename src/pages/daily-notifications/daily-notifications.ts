import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, PopoverController, ViewController } from 'ionic-angular';

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
              private viewCtrl: ViewController) {
  }

  ngOnInit() {
    if (window.location.hostname == "localhost") {
      if (this.dailyNotificationsService.isListLoaded() == false) {
        console.log("Fetch the list here using browser service.");
      }
      else {
        console.log("Do not fetch the list using browser service.");
        this.notificationList = this.dailyNotificationsService.loadList();
      }
    }
    else {
      if (this.dailyNotificationsService.isListLoaded() == false) {
        console.log("Fetch the list here using device service.");
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
    console.log("Refresh the list.");
  }

}
