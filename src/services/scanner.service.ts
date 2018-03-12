import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Injectable } from '@angular/core';

import { ItemRecord } from '../assets/models/item-record.model';


@Injectable()
export class ScannerService {

  constructor(private scanner: BarcodeScanner) {

  }

  public scan() {
    return this.scanner.scan()
    .then(
      (scan) => {
        return new ItemRecord(scan.text,"box",0,false);
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
