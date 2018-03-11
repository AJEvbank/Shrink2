import { ItemRecord } from './item-record.model';

export class ItemCollection {

  public item: ItemRecord;
  public quantity: number;
  public unitPrice: number;

  constructor(item: ItemRecord, quantity: number, unitPrice: number) {
    this.item = item;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
  }

}
