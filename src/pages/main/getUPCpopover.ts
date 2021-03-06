import { Component, OnInit } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

@Component({
  selector: 'get-upc-popover',
  template: `
  <ion-content padding class="no-scroll">
    <form [formGroup]="upc">
      <ion-input type="text" formControlName="upc" placeholder="Enter UPC" (ngSubmit)="submit()"></ion-input>
      <ion-item *ngIf="upc.controls['upc'].hasError('CheckDigit') == true && !upc.controls['upc'].hasError('pattern') && upc.controls['upc'].value.length == 12" text-wrap>
        <ion-label>The last digit should be {{ this.getCheckDigit(true) }}.</ion-label>
      </ion-item>
      <ion-item *ngIf="upc.controls['upc'].hasError('pattern') == true" text-wrap>
        <ion-label>The code must have exactly twelve digits.</ion-label>
      </ion-item>
      <button ion-button block (click)="submit()" [disabled]="!upc.valid">Use UPC</button>
    </form>
    <ion-content padding>
      <button ion-button block color="danger" (click)="dismiss(true)">Cancel</button>
    </ion-content>
  </ion-content>
  `
})

export class GetUPCPopover implements OnInit {

  private upc: FormGroup;
  private checkDigit: Number;

  constructor(private viewCtrl: ViewController) {

  }

  ngOnInit() {
    this.initializeForm();
    let tempA = this.checkDigit;
    tempA = 0;
    this.dismiss(false);
    this.getCheckDigit(false);
  }

  private initializeForm() : void {
    this.upc = new FormGroup({
      'upc': new FormControl("",
                              [
                                Validators.required,
                                Validators.pattern(/^[0-9]{12}$/),
                                this.CheckDigitValidator()
                              ]
                             )
    });
    return;
  }


  // Validators.minLength(12),
  // Validators.maxLength(12),

  submit() {
    let value = this.upc.value;
    this.viewCtrl.dismiss(value.upc);
  }

  private dismiss(clear: boolean) : void {
    if (clear == false) return;
    let dismissString = "NO_UPC";
    this.viewCtrl.dismiss(dismissString);
    return;
  }

  private CheckDigitValidator() : ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      if (control.value.length < 12) return null;
      let isCorrectCheckDigit: boolean;
      let oddSum: Number  = 0;
      let evenSum: Number = 0;
      let finalSum: Number = 0;
      let higherMultipleOfTen: Number;
      let correctCheckDigit: Number;
      let checkDigit: number = Number(control.value[control.value.length - 1]);
      for (let i = control.value.length - 2; i >= 0; i--) {
        if (Number(i % 2) == 0) { // These are really the odd numbered digits.
          evenSum = Number(evenSum) + Number(control.value[i]);
        }
        else if (Number(i % 2) == 1) { // These are really the even numbered digits.
          oddSum = Number(oddSum) + Number(control.value[i]);
        }
      }
      finalSum = Number(3 * Number(evenSum)) + Number(oddSum);
      higherMultipleOfTen = Math.ceil(Number(finalSum) / 10) * 10;
      correctCheckDigit = Number(higherMultipleOfTen) - Number(finalSum);
      isCorrectCheckDigit = (correctCheckDigit == checkDigit);
      return isCorrectCheckDigit ? null : { 'CheckDigit': correctCheckDigit };
    }
  }

  private getCheckDigit(clear: boolean) : Number {
    if (clear == false) return 0;
    return this.upc.controls['upc'].getError('CheckDigit');
  }

}
