import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { ItemRecord } from '../../../assets/models/item-record.model';

import { AWSCommService } from '../../../services/AWSComm.service';
import { AWSCommBrowserService } from '../../../services/AWSCommBrowser.service';

@Component({
  selector: 'page-edit-item-record',
  templateUrl: 'edit-item-record.html',
})
export class EditItemRecordPage implements OnInit {

  item: ItemRecord;
  itemForm: FormGroup;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private viewCtrl: ViewController,
              private AWS: AWSCommService,
              private AWSB: AWSCommBrowserService) {

  }

  ngOnInit() {
    this.item = this.navParams.get('item');
    this.initializeForm();
  }

  private initializeForm() {
    this.itemForm = new FormGroup({
      'upc': new FormControl(this.item.upc, Validators.required),
      'name': new FormControl(this.item.name, Validators.required),
      'isHighRisk': new FormControl(this.item.isHighRisk, Validators.required),
      'references': new FormControl(this.item.references, Validators.required)
    });
  }

  onSubmit() {
    let oldValue = new ItemRecord(this.item.upc, this.item.name, this.item.isHighRisk);
    let value = this.itemForm.value;
    this.item.name = value.name;
    // REMINDER: Server logic here.
    if (window.location.hostname == "localhost") {
      this.editItemBrowser(oldValue);
    }
    else {
      this.editItemAndroid(oldValue);
    }
  }

  cancel() {
    this.viewCtrl.dismiss({item: this.item});
  }

  editItemBrowser(oldValue: ItemRecord) {
    console.log("editItemBrowser: " + JSON.stringify(oldValue));
    this.AWSB.AWSupdateItemRecord(this.item)
    .then(
      (resItem) => {
        if (resItem.name == "ERROR") {
          this.viewCtrl.dismiss({item: oldValue, ErrorCode: "http error"});
        } else {
          this.viewCtrl.dismiss({item: resItem, ErrorCode: "none"});
        }
      }
    )
    .catch(
      (err) => {
        console.log("Error caught in onSubmit: " + JSON.stringify(err));
        this.viewCtrl.dismiss({item: oldValue, ErrorCode: "http error"});
      }
    );
  }

  editItemAndroid(oldValue: ItemRecord) {
    this.AWS.AWSupdateItemRecord(this.item)
    .then(
      (resItem) => {
        if (resItem.name == "EMPTY" || resItem.name == "WRONG_UPC") {
          this.viewCtrl.dismiss({item: oldValue, ErrorCode: "empty/wrong"});
        } else if (resItem.name == " ") {
          this.viewCtrl.dismiss({item: oldValue, ErrorCode: "http error"});
        } else {
          this.viewCtrl.dismiss({item: resItem, ErrorCode: "none"});
        }
      }
    )
    .catch(
      (err) => {
        console.log("Error caught in onSubmit: " + JSON.stringify(err));
        this.viewCtrl.dismiss({item: oldValue, ErrorCode: "http error"});
      }
    );
  }

}
