import { Component, OnInit } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

  AWSComm: AWSCommBrowserService | AWSCommService;

  constructor(private navParams: NavParams,
              private viewCtrl: ViewController,
              private AWS: AWSCommService,
              private AWSB: AWSCommBrowserService) {

  }

  ngOnInit() {
    this.item = this.navParams.get('item');
    this.initializeForm();
    this.AWSComm = (window.location.hostname == "localhost") ? this.AWSB : this.AWS;
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
    this.AWSComm.AWSupdateItemRecord(this.item)
    .then(
      (resItem) => {
        if (resItem.message == "ERROR") {
          this.viewCtrl.dismiss({item: oldValue, ErrorCode: "http error"});
        } else {
          this.viewCtrl.dismiss({item: resItem.item, ErrorCode: "none"});
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

  cancel() {
    this.viewCtrl.dismiss({item: this.item});
  }

}
