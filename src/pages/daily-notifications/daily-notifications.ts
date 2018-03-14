import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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
              private dailyNotificationsService: DailyNotificationsService) {
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
    this.dailyNotificationsService.fetchListTemp()
    .then(
      (list: Notification[]) => {
        this.notificationList = list;
        console.log(this.notificationList);
      }
    )
    .catch(
      (err) => console.log(err)
    );
  }

}
