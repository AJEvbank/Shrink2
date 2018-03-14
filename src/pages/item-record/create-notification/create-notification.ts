import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';


import { ItemRecord } from '../../../assets/models/item-record.model';
import { ItemCollection } from '../../../assets/models/item-collection.model';
import { Notification } from '../../../assets/models/notification.model';

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



  notificationForm: FormGroup;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private viewCtrl: ViewController) {
  }

  ngOnInit() {
    this.item = this.navParams.get('item');
    console.log(this.item);
    this.name = this.item.name;
    this.upc = this.item.upc;
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
      // The three values below will not be set by the user.
      'dateOfCreation': new FormControl(this.notification.dateOfCreation, Validators.required),
      'upc': new FormControl({value: this.notification.item.item.upc, disabled: true}, Validators.required),
      'name': new FormControl({value: this.notification.item.item.name, disabled: true}, Validators.required)
    });
  }

  onSubmit() {
    let value = this.notificationForm.value;
    this.notification.item.quantity = value.quantity;
    this.notification.item.unitPrice = value.unitPrice;
    this.notification.sellByDate = value.sellByDate;
    this.notification.daysPrior = value.daysPrior;
    this.notification.deliveryOption = value.deliveryOption;
    this.notification.memo = value.memo;

    console.log(this.notification);
    // Server logic here.
  }

  // getDate() {
  //   this.datePicker.show({
  //     date: new Date(),
  //     mode: 'date'
  //     //androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
  //   }).then(
  //     (date) => {
  //       console.log('Got date: ', date);
  //       this.notification.sellByDate = date;
  //     }
  //   )
  //   .catch(
  //     (err) => {
  //       console.log('Error occurred while getting date: ', err)
  //     }
  //   );
  // }

  leavePage() {
    this.viewCtrl.dismiss();
  }

}
