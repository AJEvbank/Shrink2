import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { Notification } from '../../assets/models/notification.model';

@Component({
  selector: 'notification-popover',
  template: `
    <ion-content padding>
        <ion-list>
        <ion-list-header>{{ notification.item.item.name }}</ion-list-header>
          <ion-item>{{ notification.item.quantity }}</ion-item>
          <ion-item text-wrap>{{ notification.memo }}</ion-item>
        </ion-list>
        <button ion-button (click)="dismiss()">Ok</button>
    </ion-content>
  `
})
export class NotificationPopoverPage implements OnInit {

  notification: Notification;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private viewCtrl: ViewController) {
  }

  ngOnInit() {
    this.notification = this.navParams.get('notification');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }



}
