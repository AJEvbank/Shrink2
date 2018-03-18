import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';

import { ItemRecord } from '../assets/models/item-record.model';


import { AWSCommService } from './AWSComm.service';


@Injectable()
export class ScannerService {


  constructor(private scanner: BarcodeScanner,
              private AWS: AWSCommService) {

  }

  public androidScan() : Promise<ItemRecord> {
    return this.scanner.scan()
    .then((scan) => {
      return this.AWS.AWSgetupc(scan.text).toPromise<ItemRecord>();
    })
    .then((item) => {
      return item;
    })
    .catch((err) => {
      console.log(err);
      return new ItemRecord("ERROR", " ");
    });
  }

}
