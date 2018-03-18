import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

import { ItemRecord } from '../assets/models/item-record.model';


import { AWSCommService } from './AWSComm.service';


@Injectable()
export class ScannerService {


  constructor(private scanner: BarcodeScanner,
              private AWS: AWSCommService) {

  }


  public androidScan() : Promise<any> {
    return this.scanner.scan()
    .then(
      (scan) => {
        return this.AWS.AWSgetupc(scan.text);
      }
    ).catch(
      (err) => {
        console.log(err);
      }
    )
  }


}
