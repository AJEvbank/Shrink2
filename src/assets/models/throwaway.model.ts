import { ItemCollection } from './item-collection.model';

export class Throwaway {

  public item: ItemCollection;
  public dateOfDiscard: Date;

  constructor(item: ItemCollection, date: Date) {
    this.item = item;
    this.dateOfDiscard = date;
  }

}
