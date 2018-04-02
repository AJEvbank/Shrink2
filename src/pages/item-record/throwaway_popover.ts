import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

import { ItemRecord } from '../../assets/models/item-record.model';
import { ItemCollection } from '../../assets/models/item-collection.model';
import { Throwaway } from '../../assets/models/throwaway.model';

import { AWSCommService } from '../../services/AWSComm.service';
import { AWSCommBrowserService } from '../../services/AWSCommBrowser.service';

@Component({
  selector: 'throwaway-popover',
  template: `
  <ion-content padding>
    <ion-item>
      <h2> {{ item.name }} </h2>
    </ion-item>
    <form [formGroup]="discard">
      <ion-item>
        <ion-label>Quantity: </ion-label>
        <ion-input type="number" formControlName="quantity"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label>Unit Price: </ion-label>
        <ion-input type="number" formControlName="unitPrice"></ion-input>
      </ion-item>
      <button ion-button block (click)="submit()" [disabled]="!discard.valid">Throwaway</button>
    </form>
    <button ion-button block color="danger" (click)="dismiss()">Cancel</button>
  </ion-content>
  `
})

export class ThrowawayQuantityPricePopoverPage implements OnInit {

  discard: FormGroup;
  item: ItemRecord;

  constructor(private viewCtrl: ViewController,
              private navParams: NavParams,
              private loadingCtrl: LoadingController,
              private AWS: AWSCommService,
              private AWSB: AWSCommBrowserService) {

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
    let loader = this.loadingCtrl.create();
    loader.present();
    console.log("value.quantity = " + value.quantity + " value.unitPrice = " + value.unitPrice);
    if (window.location.hostname == "localhost") {
      this.AWSB.AWSCreateThrowaway(new Throwaway(new ItemCollection(this.item,value.quantity,value.unitPrice),new Date()))
      .then(
        (response) => {
          loader.dismiss();
          console.log("response from AWS Service: " + JSON.stringify(response));
          this.viewCtrl.dismiss({response: response});
        }
      )
      .catch(
        (err) => {
          loader.dismiss();
          this.viewCtrl.dismiss({response: "ERROR"});
        }
      );
    }
    else {
      this.AWS.AWSCreateThrowaway(new Throwaway(new ItemCollection(this.item,value.quantity,value.unitPrice),new Date()))
      .then(
        (response) => {
          loader.dismiss();
          console.log("response from AWS Service: " + JSON.stringify(response));
          this.viewCtrl.dismiss({response: response});
        }
      )
      .catch(
        (err) => {
          loader.dismiss();
          this.viewCtrl.dismiss({response: "ERROR"});
        }
      );
    }
  }


dismiss() {
  this.viewCtrl.dismiss({response: "CANCELLED"});
}


}
