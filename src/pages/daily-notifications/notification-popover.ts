import { Component, OnInit } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { Notification } from '../../assets/models/notification.model';

import { LogHandler } from '../../assets/helpers/LogHandler';

@Component({
  selector: 'notification-popover',
  template: `
    <ion-content padding class="no-scroll">
        <ion-list no-lines>
          <h3>{{ notification.item.item.name }}</h3>
            <ion-item>
              <ion-label>UPC: {{ notification.item.item.upc }}</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Sell-By: {{ notification.sellByDate }}</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Quantity: {{ notification.item.quantity }}</ion-label>
            </ion-item>
            <ion-card>
              <ion-item>
                <ion-label>Memo:</ion-label>
              </ion-item>
              <ion-item text-wrap>{{ notification.memo }}</ion-item>
            </ion-card>
        </ion-list>
        <button ion-button block (click)="dismiss()">Ok</button>
        <button ion-button color="danger" block (click)="deleteNotification(notification.Id)">Delete Permanently</button>
    </ion-content>
  `
})
export class NotificationPopoverPage implements OnInit {

  private notification: Notification;

  private logger: LogHandler = new LogHandler("NotificationPopoverPage");

  constructor(private navParams: NavParams,
              private viewCtrl: ViewController) {
  }

  ngOnInit() {
    this.logger.logCont(this.navParams.data,"ngOnInit");
    this.notification = this.navParams.get('notification');
    this.deleteNotification(null);
  }

  private dismiss() : void {
    this.viewCtrl.dismiss({Id: null});
    return;
  }

  private deleteNotification(Id: string) : void {
    if (Id == null) return;
    this.viewCtrl.dismiss({Id: Id});
    return;
  }


}
