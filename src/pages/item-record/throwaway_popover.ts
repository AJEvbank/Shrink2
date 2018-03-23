import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

import { ItemRecord } from '../../assets/models/item-record.model';

@Component({
  selector: 'throwaway-popover',
  template: `
  <ion-content padding>
    <ion-item>
      <h2> {{ item.name }} </h2>
    </ion-item>
    <form [formGroup]="discard">
      <ion-input type="number" formControlName="quantity"></ion-input>
      <ion-input type="number" formControlName="unitPrice"></ion-input>
      <button ion-button block (click)="submit()" [disabled]="!quantity.valid">Use UPC</button>
    </form>
    <button ion-button block color="danger" (click)="dismiss()">Cancel</button>
  </ion-content>
  `
})

export class ThrowawayQuantityPricePopoverPage implements OnInit {

  discard: FormGroup;
  item: ItemRecord;

  constructor(private viewCtrl: ViewController,
              private navParams: NavParams) {

  }

  ngOnInit() {
    this.item = this.navParams.get('item');
    this.initializeForm();
  }

  private initializeForm() {
    this.discard = new FormGroup({
      'quantity': new FormControl("1",
                              [
                                Validators.required,
                                Validators.min(1)
                              ]
                            ),
      'unitPrice': new FormControl("1.00",
                              [
                                Validators.required,
                                Validators.min(0.01)
                              ]
                            ),
    });
  }

  submit() {
    let value = this.discard.value;
    console.log("value = " + value);
    this.viewCtrl.dismiss({quantity: value.quantity, unitPrice: value.unitPrice});
  }


dismiss() {
  this.viewCtrl.dismiss({quantity: "CANCELLED", unitPrice: 0});
}


}
