import { Component, OnInit } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';



import { ItemRecord } from '../../../assets/models/item-record.model';
import { ItemCollection } from '../../../assets/models/item-collection.model';
import { Notification } from '../../../assets/models/notification.model';

import { DailyNotificationsService } from '../../../services/daily-notifications.service';

import moment from 'moment';

@Component({
  selector: 'page-create-notification',
  templateUrl: 'create-notification.html',
})
export class CreateNotificationPage implements OnInit {

  private item: ItemRecord;
  private name: string;
  private upc: string;
  private itemCollection: ItemCollection;
  private notification: Notification;

  private displayDate: Date;

  notificationForm: FormGroup;


  constructor(private navParams: NavParams,
              private viewCtrl: ViewController,
              private dailyNotificationsService: DailyNotificationsService) {
  }

  ngOnInit() {
    this.item = this.navParams.get('item');
    console.log(this.item);
    this.name = this.item.name;
    this.upc = this.item.upc;
    this.displayDate = new Date();
    this.itemCollection = new ItemCollection(this.item, 0, 0);
    this.notification = new Notification(this.itemCollection, new Date(), 3, Notification.Option.NONE, "");
    this.initializeForm();
    // let offset = (new Date()).getTimezoneOffset();
    // console.log("sellByDate: " + this.displayDate + " offset: " + offset);
    // let testMomentDateTime = moment().add(-2 * offset,'minutes').format('MM/DD/YYYY, HH:mm:ss a');
    // console.log("testMomentDateTime: " + testMomentDateTime);
    // this.displayDate = (new Date(testMomentDateTime)).toString();
    // console.log("sellByDate: " + this.displayDate + " offset: " + offset);
  }

  private initializeForm() {
    this.notificationForm = new FormGroup({
      'itemCollection': new FormControl(this.notification.item, Validators.required),
      'quantity': new FormControl(this.notification.item.quantity, Validators.required),
      'unitPrice': new FormControl(this.notification.item.unitPrice, Validators.required),
      'sellByDate': new FormControl(this.notification.sellByDate.toISOString(), Validators.required),
      'daysPrior': new FormControl(this.notification.daysPrior, Validators.required),
      'deliveryOption': new FormControl(this.notification.deliveryOption, Validators.required),
      'memo': new FormControl(this.notification.memo, Validators.required),
      'dateOfCreation': new FormControl(this.notification.dateOfCreation, Validators.required),
      'upc': new FormControl({value: this.notification.item.item.upc, disabled: true}, Validators.required),
      'name': new FormControl({value: this.notification.item.item.name, disabled: true}, Validators.required),
    });
  }

  onSubmit() {
    let value = this.notificationForm.value;
    let sellByDate = new Date(value.sellByDate);
    console.log("sellByDate var: " + sellByDate.toUTCString());
    console.log("value.sellByDate var: " + value.sellByDate);

    this.notification.item.quantity = value.quantity;
    this.notification.item.unitPrice = value.unitPrice;
    this.notification.sellByDate = value.sellByDate;
    this.notification.daysPrior = value.daysPrior;
    this.notification.deliveryOption = value.deliveryOption;
    this.notification.memo = value.memo;

    console.log(this.notification);
    // Server logic here.
    // For now.
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
