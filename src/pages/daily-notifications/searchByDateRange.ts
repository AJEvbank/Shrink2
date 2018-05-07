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
      <button ion-button block color="danger" (click)="dismiss(true)">Cancel</button>
    </ion-content>
  </ion-content>
  `
})

export class SearchByDateRangePopover implements OnInit {

  private dateRange: FormGroup;
  private from: Date;
  private to: Date;
  private fromMoment: string;
  private toMoment: string;

  constructor(private viewCtrl: ViewController,
              private alertCtrl: AlertController) {

  }

  ngOnInit() {
    this.from = new Date();
    this.to = new Date();
    this.fromMoment = moment().format();
    this.toMoment = moment().format();
    this.initializeForm();
    this.dismiss(false);
  }

  private initializeForm() : void {
    this.dateRange = new FormGroup({
      'from': new FormControl(this.fromMoment,
                              [ Validators.required ]
                            ),
      'to': new FormControl(this.toMoment,
                              [ Validators.required ]
                            ),
    });
    return;
  }

  submit() {
    let value = this.dateRange.value;
    if (value.from > value.to) {
      let error = this.alertCtrl.create({title: 'Error', message: "'To' date cannot be prior to 'From' date.", buttons: ['Dismiss']});
      error.present();
    }
    else {
      this.viewCtrl.dismiss({from: value.from, to: value.to, cancelled: false});
    }
  }


  private dismiss(clear: boolean) : void {
    if (clear == false) return;
    this.viewCtrl.dismiss({from: null, to: null, cancelled: true});
    return;
  }


}
