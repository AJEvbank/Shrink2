import { ItemCollection } from './item-collection.model';

export class Notification {

  public item: ItemCollection;
  public sellByDate: Date;
  public daysPrior: number;
  public deliveryOption: Notification.Option;
  // MEMO: add property for date of creation.
  public dateOfCreation: Date;
  // MEMO: add memo property (string) for user's notes.
  public memo: string;

  constructor(item: ItemCollection, sellByDate: Date, daysPrior=3, deliveryOption=Notification.Option.NONE, memo: string) {
    this.item = item;
    this.sellByDate = sellByDate;
    this.daysPrior = daysPrior;
    this.deliveryOption = deliveryOption;
    this.memo = memo;
    this.dateOfCreation = new Date();
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
