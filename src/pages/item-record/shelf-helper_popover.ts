import { Component, OnInit } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ItemRecord } from '../../assets/models/item-record.model';

@Component({
  selector: 'shelf-helper-popover',
  template: `
  <ion-content padding class="no-scroll">
    <ion-item>
      <h2>{{ item.name }} </h2>
    </ion-item>
    <form [formGroup]="quantity">
      <ion-item>
        <ion-label>Quantity: </ion-label>
        <ion-input type="number" formControlName="quantity"></ion-input>
      </ion-item>
      <ion-item *ngIf="this.quantity.controls.quantity.hasError('min')" text-wrap>
        <ion-label>Quantity must be one or greater.</ion-label>
      </ion-item>
      <ion-item *ngIf="this.quantity.controls['quantity'].hasError('pattern') && !this.quantity.controls.quantity.hasError('min')" text-wrap>
        <ion-label>Cannot have leading zeros.</ion-label>
      </ion-item>
      <button ion-button block (click)="submit()" [disabled]="!quantity.valid">Add</button>
    </form>
    <button ion-button block color="danger" (click)="dismiss()">Cancel</button>
  </ion-content>
  `
})

export class ShelfHelperAddQuantityPopover implements OnInit {

  quantity: FormGroup;
  item: ItemRecord;

  constructor(private viewCtrl: ViewController,
              private navParams: NavParams) {

  }

  ngOnInit() {
    this.item = this.navParams.get('item');
    this.initializeForm();
  }

  private initializeForm() {
    this.quantity = new FormGroup({
      'quantity': new FormControl("1",
                              [
                                Validators.required,
                                Validators.min(1),
                                Validators.pattern(/^([1-9][0-9]*)$/)
                              ]
                             )
    });
  }

  submit() {
    let value = this.quantity.value;
    this.viewCtrl.dismiss({quantity: value.quantity});
  }


  dismiss() {
    let dismissString = "NO_Quantity";
    this.viewCtrl.dismiss({quantity: dismissString});
  }


}
