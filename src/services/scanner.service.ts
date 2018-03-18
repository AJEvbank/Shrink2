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

  public androidScan() : Promise<string> {
    return this.scanner.scan()
    .then((result) => {
      return result.text;
    })
    .catch((err) => {
      console.log(JSON.stringify(err));
      return " ";
    })
  }

}
