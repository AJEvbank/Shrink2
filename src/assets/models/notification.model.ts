import { ItemCollection } from './item-collection.model';

import moment from 'moment';

export class Notification {

  public item: ItemCollection;
  public sellByDate: Date;
  public daysPrior: number;
  public deliveryOption: Notification.Option;

  public dateOfCreation: string;
  
  public memo: string;
  public Id: string;

  constructor(item: ItemCollection, sellByDate: Date, daysPrior=3, deliveryOption=Notification.Option.NONE, memo: string, id=null) {
    this.item = item;
    this.sellByDate = sellByDate;
    this.daysPrior = daysPrior;
    this.deliveryOption = deliveryOption;
    this.memo = memo;
    this.dateOfCreation = moment((new Date()).valueOf()).format("YYYY-MM-DD");
    this.Id = id;
  }
}


export namespace Notification {
  export enum Option {
    EMAIL = "email",
    PUSH = "push",
    TEXT = "text",
    NONE = "none"
  }
}
