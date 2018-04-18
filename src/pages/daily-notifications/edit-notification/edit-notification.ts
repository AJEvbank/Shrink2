import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';


import { ItemRecord } from '../../../assets/models/item-record.model';
import { ItemCollection } from '../../../assets/models/item-collection.model';
import { Notification } from '../../../assets/models/notification.model';

import { DailyNotificationsService } from '../../../services/daily-notifications.service';

import moment from 'moment';

@Component({
  selector: 'page-edit-notification',
  templateUrl: 'edit-notification.html',
})
export class EditNotificationPage {

  private item: ItemRecord;
  private name: string;
  private upc: string;
  private itemCollection: ItemCollection;
  private notification: Notification;

  private displayDate: Date;

  notificationForm: FormGroup;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private viewCtrl: ViewController,
              private dailyNotificationsService: DailyNotificationsService) {
  }

  ngOnInit() {
    this.notification = this.navParams.get('notification');
    console.log("Notification in ngOnInit(): " + JSON.stringify(this.notification));
    console.log("\n\n\n");
    this.name = this.notification.item.item.name;
    this.upc = this.notification.item.item.upc;
    this.displayDate = new Date(this.notification.sellByDate);
    console.log("displayDate: " + this.displayDate);
    this.itemCollection = new ItemCollection(this.notification.item.item, this.notification.item.quantity, this.notification.item.unitPrice);
    this.initializeForm();
  }

  private initializeForm() {
    this.notificationForm = new FormGroup({
      'itemCollection': new FormControl(this.notification.item, Validators.required),
      'quantity': new FormControl(this.notification.item.quantity, Validators.required),
      'unitPrice': new FormControl(this.notification.item.unitPrice, Validators.required),
      'sellByDate': new FormControl(this.displayDate.toISOString(), Validators.required),
      'daysPrior': new FormControl(this.notification.daysPrior, Validators.required),
      'deliveryOption': new FormControl(this.notification.deliveryOption, Validators.required),
      'memo': new FormControl(this.notification.memo, Validators.required),
      'dateOfCreation': new FormControl(this.notification.dateOfCreation, Validators.required),
      'upc': new FormControl({value: this.notification.item.item.upc, disabled: true}, Validators.required),
      'name': new FormControl({value: this.notification.item.item.name, disabled: true}, Validators.required),
    });
  }

  onSubmit(message: string) {
    console.log("message in onSubmit(): " + message);

    let value = this.notificationForm.value;

    console.log("value.sellByDate var: " + value.sellByDate);

    this.notification.item.quantity = value.quantity;
    this.notification.item.unitPrice = value.unitPrice;
    this.notification.sellByDate = value.sellByDate;
    this.notification.daysPrior = value.daysPrior;
    this.notification.deliveryOption = value.deliveryOption;
    this.notification.memo = value.memo;
    if(message == 'create') {
      this.notification.Id = null;
      console.log("message == " + message);
      console.log("this.notification.Id == " + this.notification.Id);
    }

    console.log("notification in onSubmit(): " + JSON.stringify(this.notification));
    this.dailyNotificationsService.addItem(this.notification)
    .then(
      (data) => {
        this.viewCtrl.dismiss(data);
      }
    )
    .catch(
      (err) => {
        console.log("Error caught in onSubmit(): " + err.toString() + " Stringified error: " + JSON.stringify(err));
        this.viewCtrl.dismiss("ERROR");
      }
    );
  }

  leavePage() {
    this.viewCtrl.dismiss();
  }


}
