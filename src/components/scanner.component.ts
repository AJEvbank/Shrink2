import { Component, EventEmitter, Output } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { ItemRecord } from '../assets/models/item-record.model';

@Component({
  selector: 'app-scanner',
  templateUrl: 'scanner.component.html'
})
export class ScannerComponent {

  @Output() didScan: EventEmitter<ItemRecord> = new EventEmitter<ItemRecord>();

  constructor(private scanner: BarcodeScanner){}

  scanItem() {
    return this.scanner.scan()
    .then(
      (scan) => {
        this.didScan.emit(new ItemRecord(scan.text,"thing",0,false));
      }
    )
    .catch(
      (err) => {
        console.log(err);
        this.didScan.emit(new ItemRecord("0000000000","I DUN BROKE!",0,false));
      }
    )
  }
}
