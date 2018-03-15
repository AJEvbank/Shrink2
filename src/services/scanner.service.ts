import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

import { ItemRecord } from '../assets/models/item-record.model';


@Injectable()
export class ScannerService {

  constructor(private scanner: BarcodeScanner,
              private platform: Platform) {

  }

  
  public androidScan() {
    return this.scanner.scan()
    .then(
      (scan) => {
        return new ItemRecord(scan.text,"thing",0,false);
      }
      // REMINDER: Server communication logic.

    )
    .catch(
      (err) => {
        console.log(err);
      }
    )
  }

  
}
