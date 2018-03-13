import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { ItemRecord } from '../../../assets/models/item-record.model';
import { ItemCollection } from '../../../assets/models/item-collection.model';
import { Notification } from '../../../assets/models/notification.model';

@Component({
  selector: 'page-create-notification',
  templateUrl: 'create-notification.html',
})
export class CreateNotificationPage implements OnInit {

  item: ItemRecord;
  itemCollection: ItemCollection;
  notification: Notification;



  notificationForm: FormGroup;

  constructor(private navCtrl: NavController,
              private navParams: NavParams) {
  }

  ngOnInit() {
    this.item = this.navParams.get('item');
    this.itemCollection = new ItemCollection(this.item, 0, 0);
    this.notification = new Notification(this.itemCollection, new Date(), 3, Notification.Option.NONE, "");
    this.initializeForm();
  }

  private initializeForm() {
    this.notificationForm = new FormGroup({
      'itemCollection': new FormControl(this.notification.item, Validators.required),
      'quantity': new FormControl(this.notification.item.quantity, Validators.required),
      'unitPrice': new FormControl(this.notification.item.unitPrice, Validators.required),
      'sellByDate': new FormControl(this.notification.sellByDate, Validators.required),
      'daysPrior': new FormControl(this.notification.daysPrior, Validators.required),
      'deliveryOption': new FormControl(this.notification.deliveryOption, Validators.required),
      'memo': new FormControl(this.notification.memo, Validators.required),
      'dateOfCreation': new FormControl(this.notification.dateOfCreation, Validators.required),
    });
  }

  onSubmit() {

  }

  getDate() {
    
  }


}
