import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import { ItemRecord } from '../../assets/models/item-record.model';

@Component({
  selector: 'get-upc-popover',
  template: `
  <ion-content padding>
    <ion-item>
      <h2>{{ item.name }} </h2>
    </ion-item>
    <form [formGroup]="quantity">
      <ion-input type="number" formControlName="quantity"></ion-input>
      <button ion-button block (click)="submit()" [disabled]="!quantity.valid">Use UPC</button>
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
                                Validators.min(1)
                              ]
                             )
    });
  }

  submit() {
    let value = this.quantity.value;
    console.log("value = " + value);
    this.viewCtrl.dismiss({quantity: value.quantity});
  }


dismiss() {
  let dismissString = "NO_Quantity";
  this.viewCtrl.dismiss({quantity: dismissString});
}


}
