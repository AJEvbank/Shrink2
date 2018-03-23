import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { ToGetItem } from '../../assets/models/to-get-item.model';

@Component({
  selector: 'to-get-popover',
  template: `
    <ion-content padding>
        <ion-list no-lines>
        <h3>{{ to.item.item.name }}</h3>
          <ion-item>
            <ion-label>Quantity: {{ notification.item.quantity }}</ion-label>
          </ion-item>
          <ion-item>
            <ion-label>Memo:</ion-label>
          </ion-item>
          <ion-item text-wrap>{{ notification.memo }}</ion-item>
        </ion-list>
        <button ion-button (click)="dismiss()">Ok</button>
    </ion-content>
  `
})
export class ToGetEditPage implements OnInit {

  toGet: ToGetItem;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private viewCtrl: ViewController) {
  }

  ngOnInit() {
    this.toGet = this.navParams.get('toGet');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }



}
