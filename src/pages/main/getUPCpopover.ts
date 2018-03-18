import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'get-upc-popover',
  template: `
  <ion-content padding>
    <form [formGroup]="upc">
      <ion-input type="text" formControlName="upc"></ion-input>
      <button ion-button block (click)="submit()">Use UPC</button>
    </form>
  </ion-content>
  `
})

export class GetUPCPopover implements OnInit {

  upc: FormGroup;

  constructor(private viewCtrl: ViewController) {

  }

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.upc = new FormGroup({
      'upc': new FormControl("000000000000", Validators.required)
    });
  }

  submit() {
    let value = this.upc.value;
    this.viewCtrl.dismiss(value.upc);
  }


}
