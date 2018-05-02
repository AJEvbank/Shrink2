import { ItemCollection } from './item-collection.model';

import moment from 'moment';

export class Throwaway {

  public item: ItemCollection;
  public dateOfDiscard: Date;

  constructor(item: ItemCollection, date: Date) {
    this.item = item;
    this.dateOfDiscard = date;
  }

}
