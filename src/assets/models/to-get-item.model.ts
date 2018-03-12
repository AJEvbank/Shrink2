import { ItemRecord } from './item-record.model';

export class ToGetItem {

  public item: ItemRecord;
  public quantity: number;

  constructor(item: ItemRecord, quantity: number) {
    this.item = item;
    this.quantity = quantity;
  }

}
