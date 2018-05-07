import { Component, OnInit } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ToGetItem } from '../../assets/models/to-get-item.model';

import { LogHandler } from '../../assets/helpers/LogHandler';

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
            <ion-item *ngIf="this.toGetForm.controls.quantity.hasError('min')" text-wrap>
              <ion-label>Quantity must be one or greater.</ion-label>
            </ion-item>
            <ion-item *ngIf="this.toGetForm.controls.quantity.hasError('pattern') && !this.toGetForm.controls.quantity.hasError('min')" text-wrap>
              <ion-label>Cannot have decimals or leading zeros.</ion-label>
            </ion-item>
            <button type="submit" ion-button block [disabled]="!toGetForm.valid">Save Changes</button>
          </form>
        <button ion-button color="danger" (click)="dismiss(true)">Cancel</button>
    </ion-content>
  `
})
export class ToGetEditPopover implements OnInit {

  private toGet: ToGetItem;
  private toGetForm: FormGroup;

  private logger: LogHandler = new LogHandler("ToGetEditPopover");

  constructor(private navParams: NavParams,
              private viewCtrl: ViewController) {
  }

  ngOnInit() {
    this.logger.logCont(this.navParams.data,"ngOnInit");
    this.toGet = this.navParams.get('toGet');
    this.initializeForm();
    this.dismiss(false);
  }

  private initializeForm() : void {
    this.toGetForm = new FormGroup({
      'quantity': new FormControl(this.toGet.quantity, [ Validators.required,
                                                         Validators.min(1),
                                                         Validators.pattern(/^([1-9][0-9]*)$/) ])
    });
    return;
  }

  onSubmit() {
    //let oldValue = new ToGetItem(new ItemRecord(this.toGet.item.upc,this.toGet.item.name,this.toGet.item.isHighRisk),this.toGet.quantity);
    let value = this.toGetForm.value;
    this.toGet.quantity = Math.trunc(value.quantity);
    this.viewCtrl.dismiss({toGet: this.toGet});
  }

  private dismiss(clear: boolean) : void {
    if (clear == false) return;
    this.viewCtrl.dismiss({toGet: this.toGet});
    return;
  }



}
