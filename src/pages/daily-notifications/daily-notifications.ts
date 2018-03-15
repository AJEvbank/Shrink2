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
    this.dailyNotificationsService.fetchListTemp()
    .then(
      (list: Notification[]) => {
        this.notificationList = list;
      }
    )
    .catch(
      (err) => console.log(err)
    );
  }

  deleteTask(index: number) {
    console.log("delete " + index);
    this.dailyNotificationsService.removeItem(index);
    this.notificationList = this.dailyNotificationsService.loadList();
  }

  viewNotes(clickEvent, notification: Notification) {
    let popover = this.popoverController.create(NotificationPopoverPage, {notification: notification});
    popover.present();
  }

}
