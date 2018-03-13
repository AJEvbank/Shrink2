import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

import { ItemRecord } from '../assets/models/item-record.model';


@Injectable()
export class ScannerService {

  constructor(private scanner: BarcodeScanner,
              private platform: Platform) {

  }

  public typeScan() {
    if (this.platform.is('android')) {
      return this.androidScan();
    }
    else {
      return this.browserScan();
    }
  }

  private androidScan() {
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

  public browserScan() {
    //let quickItem = new ItemRecord("000000000000","box",0,false);
    return new Promise(function (fulfill, reject){
      return new ItemRecord("000000000000","box",0,false);
    });
  }

}
