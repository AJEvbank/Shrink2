import { Component, OnInit } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ItemRecord } from '../../../assets/models/item-record.model';

import { AWSCommService } from '../../../services/AWSComm.service';
import { AWSCommBrowserService } from '../../../services/AWSCommBrowser.service';

import { LogHandler } from '../../../assets/helpers/LogHandler';

@Component({
  selector: 'page-edit-item-record',
  templateUrl: 'edit-item-record.html',
})
export class EditItemRecordPage implements OnInit {

  item: ItemRecord;
  itemForm: FormGroup;

  AWSComm: AWSCommBrowserService | AWSCommService;;

  logger: LogHandler = new LogHandler("EditItemRecordPage");

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
        this.logger.logCont(resItem,"onSubmit");
        if (resItem.message == "ERROR" || resItem.message == "UNDEFINED") {
          this.viewCtrl.dismiss({item: oldValue, ErrorCode: "http error"});
        } else {
          this.viewCtrl.dismiss({item: resItem.item, ErrorCode: "none"});
        }
      }
    )
    .catch(
      (err) => {
        this.logger.logErr(err,"onSubmit");
        this.viewCtrl.dismiss({item: oldValue, ErrorCode: "http error"});
      }
    );
  }

  private cancel() : void {
    this.viewCtrl.dismiss({item: this.item, ErrorCode: "cancelled"});
    return;
  }

}
