import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { ToGetItem } from '../../assets/models/to-get-item.model';
import { ItemRecord } from '../../assets/models/item-record.model';

import { ShelfHelperService } from '../../services/shelf-helper.service';

@Component({
  selector: 'to-get-popover',
  template: `
    <ion-content padding>
        <form [formGroup]="toGetForm" (ngSubmit)="onSubmit()">
            <h3>{{ toGet.item.name }}</h3>
            <ion-item>
              <ion-label>Quantity:</ion-label>
              <ion-input type="number" formControlName="quantity"></ion-input>
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

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private viewCtrl: ViewController,
              private shelfHelperService: ShelfHelperService) {
  }

  ngOnInit() {
    this.toGet = this.navParams.get('toGet');
    this.initializeForm();
  }

  private initializeForm() {
    this.toGetForm = new FormGroup({
      'quantity': new FormControl(this.toGet.quantity, [ Validators.required, Validators.min(0) ])
    });
  }

  onSubmit() {
    //let oldValue = new ToGetItem(new ItemRecord(this.toGet.item.upc,this.toGet.item.name,this.toGet.item.isHighRisk),this.toGet.quantity);
    let value = this.toGetForm.value;
    this.toGet.quantity = value.quantity;
    console.log("onSubmit: " + JSON.stringify(this.toGet));
    this.viewCtrl.dismiss({toGet: this.toGet});
  }

  dismiss() {
    this.viewCtrl.dismiss({toGet: this.toGet});
  }



}