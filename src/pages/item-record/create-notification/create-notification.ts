import { Component, OnInit } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';



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

  private displayDate: string;
  private currentDay: Date;


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
    this.displayDate = moment().format("MM/DD/YYYY-HH:mm a");
    console.log("displayDate: " + this.displayDate);
    let temp = new Date();
    this.currentDay = new Date(temp.getFullYear(),temp.getMonth(),temp.getDate());
    console.log("currentDay: " + this.currentDay.toString());
    this.itemCollection = new ItemCollection(this.item, 0, 0);
    this.notification = new Notification(this.itemCollection, new Date(), 3, Notification.Option.NONE, "");
    this.initializeForm();
  }
  //this.notification.sellByDate.toISOString()

  private initializeForm() {
    this.notificationForm = new FormGroup({
      'itemCollection': new FormControl(this.notification.item, Validators.required),
      'quantity': new FormControl(this.notification.item.quantity, Validators.required),
      'unitPrice': new FormControl(this.notification.item.unitPrice, Validators.required),
      'daysPrior': new FormControl(this.notification.daysPrior, [ Validators.required, Validators.min(0) ]),
      'sellByDate': new FormControl("", [ Validators.required, this.isNotPriorToToday() ]),
      'deliveryOption': new FormControl(this.notification.deliveryOption, Validators.required),
      'memo': new FormControl(this.notification.memo, Validators.required),
      'dateOfCreation': new FormControl(this.notification.dateOfCreation, Validators.required),
      'upc': new FormControl({value: this.notification.item.item.upc, disabled: true}, Validators.required),
      'name': new FormControl({value: this.notification.item.item.name, disabled: true}, Validators.required),
    }, this.isDeliveredPriorToToday('daysPrior', 'sellByDate'));
  }

  onSubmit() {
    let value = this.notificationForm.value;

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

  private isNotPriorToToday() : ValidatorFn {
    return (ctrl: AbstractControl): {[key: string]: any} => {
      if (ctrl.value == "") return null;
      let today = this.currentDay;
      let day: string = ctrl.value.slice(8,10);
      let month: string = ctrl.value.slice(5,7);
      let year: string = ctrl.value.slice(0,4);
      let realValue = new Date(Number(year),Number(month) - 1,Number(day));
      console.log("today = " + today.toString() + "ctrl.value = " + ctrl.value + " realValue = " + realValue.toString());
      if (realValue < today) {
        let returnDataI = moment(realValue.valueOf()).format("MM/DD/YYYY");
        return {'isPriorToToday': returnDataI};
      }
      else {
        return null;
      }
    }
  }

  private isDeliveredPriorToToday(daysPriorCtrlString: string, sellByDateCtrlString: string) : ValidatorFn {
    return (group: FormGroup): {[key: string]: any} => {
      let daysPriorCtrl = group.controls[daysPriorCtrlString];
      let sellByDateCtrl = group.controls[sellByDateCtrlString];
      if (sellByDateCtrl.value == "") return null;
      let today = this.currentDay;
      let day: string = sellByDateCtrl.value.slice(8,10);
      let month: string = sellByDateCtrl.value.slice(5,7);
      let year: string = sellByDateCtrl.value.slice(0,4);
      let daysPrior = daysPriorCtrl.value;
      let deliveryDate = new Date(Number(year),Number(month) - 1,Number(day) - Number(daysPrior));
      console.log("today = " + today.toString() + "sellByDateCtrl.value = " + sellByDateCtrl.value + " deliveryDate = " + deliveryDate.toString());
      if (deliveryDate < today) {
        let returnDataD = moment(deliveryDate.valueOf()).format("MM/DD/YYYY");
        return {'isDeliveredPriorToToday': returnDataD};
      }
      else {
        return null;
      }
    }
  }

}
