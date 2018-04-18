import { Component, OnInit } from '@angular/core';
import { ViewController, AlertController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import moment from 'moment';

@Component({
  selector: 'search-by-date-range',
  template: `
  <ion-content padding class="no-scroll">
    <form [formGroup]="dateRange">
    <ion-item>
      <ion-label>From:</ion-label>
      <ion-datetime displayFormat="MM/DD/YYYY" pickerFormat="MM DD YYYY" formControlName="from"
                    placeholder="{{ from }}"></ion-datetime>
    </ion-item>
    <ion-item>
      <ion-label>To:</ion-label>
      <ion-datetime displayFormat="MM/DD/YYYY" pickerFormat="MM DD YYYY" formControlName="to"
                    placeholder="{{ to }}"></ion-datetime>
    </ion-item>
      <button ion-button block (click)="submit()" [disabled]="!dateRange.valid">Get Notifications</button>
    </form>
    <ion-content padding>
      <button ion-button block color="danger" (click)="dismiss()">Cancel</button>
    </ion-content>
  </ion-content>
  `
})

export class SearchByDateRangePopover implements OnInit {

  dateRange: FormGroup;
  from: Date;
  to: Date;
  fromMoment: string;
  toMoment: string;

  constructor(private viewCtrl: ViewController,
              private alertCtrl: AlertController) {

  }

  ngOnInit() {
    this.from = new Date();
    console.log("from: " + this.from);
    this.to = new Date();
    console.log("from: " + this.to);
    this.fromMoment = moment().format();
    console.log("fromMoment: " + this.fromMoment);
    this.toMoment = moment().format();
    console.log("toMoment: " + this.toMoment);
    this.initializeForm();
  }

  private initializeForm() {
    this.dateRange = new FormGroup({
      'from': new FormControl(this.fromMoment,
                              [ Validators.required ]
                            ),
      'to': new FormControl(this.toMoment,
                              [ Validators.required ]
                            ),
    });
  }

  submit() {
    let value = this.dateRange.value;
    console.log("value = " + value);
    console.log("localFrom = " + (new Date(value.from)).toLocaleString());
    if (value.from > value.to) {
      let error = this.alertCtrl.create({title: 'Error', message: "'To' date cannot be prior to 'From' date.", buttons: ['Dismiss']});
      error.present();
    }
    else {
      this.viewCtrl.dismiss({from: value.from, to: value.to, cancelled: false});
    }
  }


dismiss() {
  this.viewCtrl.dismiss({from: null, to: null, cancelled: true});
}


}
