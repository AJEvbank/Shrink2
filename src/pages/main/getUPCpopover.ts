import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

@Component({
  selector: 'get-upc-popover',
  template: `
  <ion-content padding>
    <form [formGroup]="upc">
      <ion-input type="text" formControlName="upc"></ion-input>
      <button ion-button block (click)="submit()" [disabled]="!upc.valid">Use UPC</button>
    </form>
    <button ion-button block color="danger" (click)="dismiss()">Cancel</button>
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
      'upc': new FormControl("077034009521",
                              [
                                Validators.required,
                                Validators.minLength(12),
                                Validators.maxLength(12),
                                Validators.pattern(/^[0-9]*$/)
                              ]
                             )
    });
  }

  submit() {
    let value = this.upc.value;
    console.log("value = " + value);
    this.viewCtrl.dismiss(value.upc);
  }


dismiss() {
  let dismissString = "NO_UPC";
  this.viewCtrl.dismiss(dismissString);
}


}
