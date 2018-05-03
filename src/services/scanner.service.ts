import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Injectable } from '@angular/core';

import { LogHandler } from '../assets/helpers/LogHandler';



@Injectable()
export class ScannerService {

  private logger: LogHandler = new LogHandler("ScannerService");

  constructor(private scanner: BarcodeScanner) {

  }

  public androidScan() : Promise<string> {
    return this.scanner.scan()
    .then((result) => {
      this.logger.logCont(result,"androidScan");
      return result.text;
    })
    .catch((err) => {
      this.logger.logErr(err,"androidScan");
      return "ERROR";
    });
  }

}
