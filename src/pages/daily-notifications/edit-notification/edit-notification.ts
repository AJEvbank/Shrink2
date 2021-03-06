import { Component, OnInit } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import { ItemCollection } from '../../../assets/models/item-collection.model';
import { Notification } from '../../../assets/models/notification.model';

import { DailyNotificationsService } from '../../../services/daily-notifications.service';

import moment from 'moment';

import { LogHandler } from '../../../assets/helpers/LogHandler';

@Component({
  selector: 'page-edit-notification',
  templateUrl: 'edit-notification.html',
})
export class EditNotificationPage {

  private name: string;
  private upc: string;
  private itemCollection: ItemCollection;
  private notification: Notification;

  private displayDate: Date;
  private currentDay: Date;

  private notificationForm: FormGroup;

  private logger: LogHandler = new LogHandler("EditNotificationPage");

  constructor(private navParams: NavParams,
              private viewCtrl: ViewController,
              private dailyNotificationsService: DailyNotificationsService) {
  }

  ngOnInit() {
    this.logger.logCont(this.navParams.data,"ngOnInit");
    this.notification = this.navParams.get('notification');
    this.name = this.notification.item.item.name;
    this.upc = this.notification.item.item.upc;
    this.displayDate = new Date(this.notification.sellByDate);
    let temp = new Date();
    this.currentDay = new Date(temp.getFullYear(),temp.getMonth(),temp.getDate());
    this.itemCollection = new ItemCollection(this.notification.item.item, this.notification.item.quantity, this.notification.item.unitPrice);
    this.initializeForm();
    this.leavePage(false);
  }

  private initializeForm() : void {
    this.notificationForm = new FormGroup({
      'itemCollection': new FormControl(this.notification.item, Validators.required),
      'quantity': new FormControl(this.notification.item.quantity, Validators.required),
      'unitPrice': new FormControl(this.notification.item.unitPrice, Validators.required),
      'sellByDate': new FormControl(this.displayDate.toISOString(), [ Validators.required, this.isNotPriorToToday() ]),
      'daysPrior': new FormControl(this.notification.daysPrior, [ Validators.required, Validators.min(0) ]),
      'deliveryOption': new FormControl(this.notification.deliveryOption, Validators.required),
      'memo': new FormControl(this.notification.memo, Validators.required),
      'dateOfCreation': new FormControl(this.notification.dateOfCreation, Validators.required),
      'upc': new FormControl({value: this.notification.item.item.upc, disabled: true}, Validators.required),
      'name': new FormControl({value: this.notification.item.item.name, disabled: true}, Validators.required),
    }, this.isDeliveredPriorToToday('daysPrior', 'sellByDate'));
    return;
  }

  onSubmit(message: string) {

    let value = this.notificationForm.value;

    this.notification.item.quantity = value.quantity;
    this.notification.item.unitPrice = value.unitPrice;
    this.notification.sellByDate = value.sellByDate;
    this.notification.daysPrior = value.daysPrior;
    this.notification.deliveryOption = value.deliveryOption;
    this.notification.memo = value.memo;
    if(message == 'create') {
      this.notification.Id = null;
    }

    this.dailyNotificationsService.addItem(this.notification)
    .then(
      (data) => {
        this.logger.logCont(data,"onSubmit");
        this.viewCtrl.dismiss(data);
      }
    )
    .catch(
      (err) => {
        this.logger.logErr(err,"onSubmit");
        this.viewCtrl.dismiss("ERROR");
      }
    );
  }

  private leavePage(clear: boolean) : void {
    if (clear == false) return;
    this.viewCtrl.dismiss("CANCELLED");
    return;
  }

  private isNotPriorToToday() : ValidatorFn {
    return (ctrl: AbstractControl): {[key: string]: any} => {
      if (ctrl.value == "") return null;
      let today = this.currentDay;
      let day: string = ctrl.value.slice(8,10);
      let month: string = ctrl.value.slice(5,7);
      let year: string = ctrl.value.slice(0,4);
      let realValue = new Date(Number(year),Number(month) - 1,Number(day));
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
