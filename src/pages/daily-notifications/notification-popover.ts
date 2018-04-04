import { Component, OnInit } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { Notification } from '../../assets/models/notification.model';

@Component({
  selector: 'notification-popover',
  template: `
    <ion-content padding>
        <ion-list no-lines>
        <h3>{{ notification.item.item.name }}</h3>
          <ion-item>
            <ion-label>Quantity: {{ notification.item.quantity }}</ion-label>
          </ion-item>
          <ion-item>
            <ion-label>Memo:</ion-label>
          </ion-item>
          <ion-item text-wrap>{{ notification.memo }}</ion-item>
        </ion-list>
        <button ion-button block (click)="dismiss()">Ok</button>
    </ion-content>
  `
})
export class NotificationPopoverPage implements OnInit {

  notification: Notification;

  constructor(private navParams: NavParams,
              private viewCtrl: ViewController) {
  }

  ngOnInit() {
    this.notification = this.navParams.get('notification');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }



}
