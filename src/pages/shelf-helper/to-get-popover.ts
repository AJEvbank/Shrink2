import { Component, OnInit } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ToGetItem } from '../../assets/models/to-get-item.model';

@Component({
  selector: 'to-get-popover',
  template: `
    <ion-content padding class="no-scroll">
        <form [formGroup]="toGetForm" (ngSubmit)="onSubmit()">
            <h3>{{ toGet.item.name }}</h3>
            <ion-item>
              <ion-label>Quantity:</ion-label>
              <ion-input type="number" formControlName="quantity"></ion-input>
            </ion-item>
            <ion-item *ngIf="toGetForm.controls.quantity.hasError('min')">
              <ion-label>Quantity must be one or greater.</ion-label>
            </ion-item>
            <ion-item *ngIf="toGetForm.controls.quantity.hasError('pattern')">
              <ion-label>Quantity must be a valid number with no leading zeros.</ion-label>
            </ion-item>
            <button type="submit" ion-button block [disabled]="!toGetForm.valid">Save Changes</button>
          </form>
        <button ion-button color="danger" (click)="dismiss()">Cancel</button>
    </ion-content>
  `
})
export class ToGetEditPopover implements OnInit {

  toGet: ToGetItem;
  toGetForm: FormGroup;

  constructor(private navParams: NavParams,
              private viewCtrl: ViewController) {
  }

  ngOnInit() {
    this.toGet = this.navParams.get('toGet');
    this.initializeForm();
  }

  private initializeForm() {
    this.toGetForm = new FormGroup({
      'quantity': new FormControl(this.toGet.quantity, [ Validators.required, Validators.min(1) ])
    });
  }

  onSubmit() {
    //let oldValue = new ToGetItem(new ItemRecord(this.toGet.item.upc,this.toGet.item.name,this.toGet.item.isHighRisk),this.toGet.quantity);
    let value = this.toGetForm.value;
    this.toGet.quantity = Math.trunc(value.quantity);
    console.log("toGet: " + Math.trunc(value.quantity));
    this.viewCtrl.dismiss({toGet: this.toGet});
  }

  dismiss() {
    this.viewCtrl.dismiss({toGet: this.toGet});
  }



}
