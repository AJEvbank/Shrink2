import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Injectable } from '@angular/core';




@Injectable()
export class ScannerService {


  constructor(private scanner: BarcodeScanner) {

  }

  public androidScan() : Promise<string> {
    return this.scanner.scan()
    .then((result) => {
      return result.text;
    })
    .catch((err) => {
      return " ";
    })
  }

}
