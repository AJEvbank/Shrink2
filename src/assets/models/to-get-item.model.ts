import { ItemRecord } from './item-record.model';

export class ToGetItem {

  item: ItemRecord;
  quantity: number;

  constructor(item: ItemRecord, quantity: number) {
    this.item = item;
    this.quantity = quantity;
  }

}
