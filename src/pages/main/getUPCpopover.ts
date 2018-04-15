import { Component, OnInit } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'get-upc-popover',
  template: `
  <ion-content padding class="no-scroll">
    <form [formGroup]="upc">
      <ion-input type="text" formControlName="upc" (ngSubmit)="submit()"></ion-input>
      <ion-item *ngIf="upc.controls['upc'].hasError('CheckDigit') == true && !upc.controls['upc'].hasError('pattern') && upc.controls['upc'].value.length == 12" text-wrap>
        <ion-label>The last digit is incorrect.</ion-label>
      </ion-item>
      <ion-item *ngIf="upc.controls['upc'].value.length < 12" text-wrap>
        <ion-label>The code has too few digits.</ion-label>
      </ion-item>
      <ion-item *ngIf="upc.controls['upc'].value.length > 12" text-wrap>
        <ion-label>The code has too many digits.</ion-label>
      </ion-item>
      <ion-item *ngIf="upc.controls['upc'].hasError('pattern') == true" text-wrap>
        <ion-label>The code must contain only digits.</ion-label>
      </ion-item>
      <button ion-button block (click)="submit()" [disabled]="!upc.valid">Use UPC</button>
    </form>
    <ion-content padding>
      <button ion-button block color="danger" (click)="dismiss()">Cancel</button>
    </ion-content>
  </ion-content>
  `
})

// <ion-item *ngIf="upc.controls['upc'].minLength">
//   <ion-label> There is an error.</ion-label>
// </ion-item>

export class GetUPCPopover implements OnInit {

  upc: FormGroup;
  checkDigit: Number;

  constructor(private viewCtrl: ViewController) {

  }

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.upc = new FormGroup({
      'upc': new FormControl("718103101776",
                              [
                                Validators.required,
                                Validators.minLength(12),
                                Validators.maxLength(12),
                                Validators.pattern(/^[0-9]*$/),
                                this.CheckDigitValidator
                              ]
                             )
    });
  }

  submit() {
    let value = this.upc.value;
    console.log("value = " + value);
    this.viewCtrl.dismiss(value.upc);
    console.log("Error testing: " + this.upc.controls['upc'].hasError('CheckDigit'));
  }

  dismiss() {
    let dismissString = "NO_UPC";
    this.viewCtrl.dismiss(dismissString);
  }

  private CheckDigitValidator(ctrl: FormControl) {
    if (ctrl.value.length < 12) return null;
    let isCorrectCheckDigit: boolean;
    let oddSum: Number  = 0;
    let evenSum: Number = 0;
    let finalSum: Number = 0;
    let higherMultipleOfTen: Number;
    let correctCheckDigit: Number;
    let checkDigit: number = Number(ctrl.value[ctrl.value.length - 1]);
    for (let i = ctrl.value.length - 2; i >= 0; i--) {
      if (Number(i % 2) == 0) { // These are really the odd numbered digits.
        evenSum = Number(evenSum) + Number(ctrl.value[i]);
      }
      else if (Number(i % 2) == 1) { // These are really the even numbered digits.
        oddSum = Number(oddSum) + Number(ctrl.value[i]);
      }
    }
    finalSum = Number(3 * Number(evenSum)) + Number(oddSum);
    higherMultipleOfTen = Math.ceil(Number(finalSum) / 10) * 10;
    correctCheckDigit = Number(higherMultipleOfTen) - Number(finalSum);
    isCorrectCheckDigit = (correctCheckDigit == checkDigit);
    return isCorrectCheckDigit ? null : { 'CheckDigit': correctCheckDigit };
  }

  // getCheckDigit(code: string) : Number {
  //   let oddSum: Number  = 0;
  //   let evenSum: Number = 0;
  //   let finalSum: Number = 0;
  //   let higherMultipleOfTen: Number;
  //   let correctCheckDigit: Number;
  //   let checkDigit: number = Number(code[code.length - 1]);
  //   for (let i = code.length - 2; i >= 0; i--) {
  //     if (Number(i % 2) == 0) { // These are really the odd numbered digits.
  //       evenSum = Number(evenSum) + Number(code[i]);
  //     }
  //     else if (Number(i % 2) == 1) { // These are really the even numbered digits.
  //       oddSum = Number(oddSum) + Number(code[i]);
  //     }
  //   }
  //   finalSum = Number(3 * Number(evenSum)) + Number(oddSum);
  //   higherMultipleOfTen = Math.ceil(Number(finalSum) / 10) * 10;
  //   correctCheckDigit = Number(higherMultipleOfTen) - Number(finalSum);
  //   this.checkDigit = correctCheckDigit;
  //   return correctCheckDigit;
  // }

}
