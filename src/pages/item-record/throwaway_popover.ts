import { Component, OnInit } from '@angular/core';
import { NavParams, ViewController, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ItemRecord } from '../../assets/models/item-record.model';
import { ItemCollection } from '../../assets/models/item-collection.model';
import { Throwaway } from '../../assets/models/throwaway.model';

import { AWSCommService } from '../../services/AWSComm.service';
import { AWSCommBrowserService } from '../../services/AWSCommBrowser.service';

import { LogHandler } from '../../assets/helpers/LogHandler';

@Component({
  selector: 'throwaway-popover',
  template: `
  <ion-content padding class="no-scroll">
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
      <ion-item>
        <ion-label>Date: </ion-label>
        <ion-datetime displayFormat="MM/DD/YYYY" pickerFormat="MM DD YYYY" formControlName="dateOfDiscard"
                      placeholder="discard date"></ion-datetime>
      </ion-item>
      <button ion-button block (click)="submit()" [disabled]="!discard.valid">Throwaway</button>
    </form>
    <button ion-button block color="danger" (click)="dismiss(true)">Cancel</button>
  </ion-content>
  `
})

export class ThrowawayQuantityPricePopoverPage implements OnInit {

  private discard: FormGroup;
  private item: ItemRecord;
  private AWSComm: AWSCommService | AWSCommBrowserService;

  private logger: LogHandler = new LogHandler("ThrowawayQuantityPricePopoverPage");

  constructor(private viewCtrl: ViewController,
              private navParams: NavParams,
              private loadingCtrl: LoadingController,
              private AWS: AWSCommService,
              private AWSB: AWSCommBrowserService) {
    this.AWSComm = (window.location.hostname == "localhost") ? this.AWSB : this.AWS;
  }

  ngOnInit() {
    this.logger.logCont(this.navParams.data,"ngOnInit");
    this.item = this.navParams.get('item');
    this.initializeForm();
    this.dismiss(false);
  }

  private initializeForm() : void {
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
      'dateOfDiscard': new FormControl("",
                              [
                                Validators.required
                              ]
                            ),
    });
    return;
  }

  submit() {
    let value = this.discard.value;
    let loader = this.loadingCtrl.create();
    loader.present();
    let newThrowaway = new Throwaway(new ItemCollection(this.item,value.quantity,value.unitPrice),value.dateOfDiscard);
    this.AWSComm.AWSCreateThrowaway(newThrowaway)
    .then(
      (message: string) => {
        this.logger.logCont(message,"submit");
        if (message == "ERROR") {
          loader.dismiss();
          this.viewCtrl.dismiss({response: message});
        }
        else if (message == "SUCCESS"){
          loader.dismiss();
          this.viewCtrl.dismiss({response: message});
        }
      }
    )
    .catch(
      (err) => {
        this.logger.logErr(err,"submit");
        loader.dismiss();
        this.viewCtrl.dismiss({response: "SUCCESS"});
      }
    );
  }


  private dismiss(clear: boolean) : void {
    if (clear == false) return;
    this.viewCtrl.dismiss({response: "CANCELLED"});
    return;
  }


}
