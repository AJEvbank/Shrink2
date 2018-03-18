import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

import { ItemRecord } from '../assets/models/item-record.model';

import { Accessor } from '../../../access';

import { AWSCommService } from './AWSComm.service';


@Injectable()
export class ScannerService {

  accessor = new Accessor();

  constructor(private scanner: BarcodeScanner,
              private AWS: AWSCommService) {

  }


  public androidScan() {
    let returnedItem;
    return this.scanner.scan()
    .then(
      (scan) => {
        return this.AWS.AWSgetupc(scan.text);
      }
    )
    .catch(
      (err) => {
        console.log(err);
      }
    )
  }


}
