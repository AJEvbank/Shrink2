import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';


import { ItemRecord } from '../../../assets/models/item-record.model';

@Component({
  selector: 'page-edit-item-record',
  templateUrl: 'edit-item-record.html',
})
export class EditItemRecordPage implements OnInit {

  item: ItemRecord;
  itemForm: FormGroup;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private viewCtrl: ViewController) {

  }

  ngOnInit() {
    this.item = this.navParams.get('item');
    this.initializeForm();
  }

  private initializeForm() {
    this.itemForm = new FormGroup({
      'upc': new FormControl(this.item.upc, Validators.required),
      'name': new FormControl(this.item.name, Validators.required),
      'weight': new FormControl(this.item.weight, Validators.required),
      'isHighRisk': new FormControl(this.item.isHighRisk, Validators.required),
      'references': new FormControl(this.item.references, Validators.required)
    });
  }

  onSubmit() {
    let value = this.itemForm.value;
    this.item.name = value.name;
    this.item.weight = value.weight;
    // REMINDER: Server logic here.
    this.viewCtrl.dismiss(this.item);
  }

}
