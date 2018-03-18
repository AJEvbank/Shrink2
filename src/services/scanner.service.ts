import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

import { ItemRecord } from '../assets/models/item-record.model';

<<<<<<< HEAD

=======
>>>>>>> f1147e6cf28fb1294d952e1ec3c2b6705c5404fe
import { AWSCommService } from './AWSComm.service';


@Injectable()
export class ScannerService {

<<<<<<< HEAD

=======
>>>>>>> f1147e6cf28fb1294d952e1ec3c2b6705c5404fe
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
