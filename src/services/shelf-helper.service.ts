import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

import { ToGetItem } from '../assets/models/to-get-item.model';


@Injectable()
export class ShelfHelperService {

  shelfHelperList: ToGetItem [];

  constructor(private storage: Storage) {}

  public addItem(item: ToGetItem) {
    let found = false, oldQuantity: number, oldIndex: number;
    for(let eachItem of this.shelfHelperList) {
      if (item.item.upc == eachItem.item.upc) {
        oldQuantity = eachItem.quantity;
        oldIndex = this.shelfHelperList.indexOf(eachItem);
        let sum : number = Number(eachItem.quantity) + Number(item.quantity);
        eachItem.quantity = sum;
        found = true;
        break;
      }
    }
    if (!found) {
      this.shelfHelperList.push(item);
    }
    this.storage.set('shelfHelperList',this.shelfHelperList)
    .then()
    .catch(
      (err) => {
        if (!found) {
          this.shelfHelperList.splice(this.shelfHelperList.indexOf(item),1);
        }
        else {
          this.shelfHelperList[oldIndex].quantity = oldQuantity;
        }
      }
    );
  }

  public removeItem(index: number) : Promise<void> {
    const itemSave: ToGetItem = this.shelfHelperList.slice(index,index + 1)[0];
    this.shelfHelperList.splice(index, 1);
    return this.storage.set('shelfHelperList',this.shelfHelperList)
    .then()
    .catch(
      (err) => {
        this.addItem(itemSave);
      }
    )
  };

  public fetchList() : Promise<ToGetItem[]> {
    return this.storage.get('shelfHelperList')
    .then(
      (list: ToGetItem []) => {
        this.shelfHelperList = list != null ? list: [];
        return this.shelfHelperList;
      }
    )
    .catch(
      (err) => {
        return this.shelfHelperList = [];
      }
    )
  }

  public loadList() {
    return this.shelfHelperList.slice();
  }

  public updateItem(toGet: ToGetItem) {
    let found = false, oldQuantity: number, oldIndex: number;
    for(let eachItem of this.shelfHelperList) {
      if (toGet.item.upc == eachItem.item.upc) {
        oldQuantity = eachItem.quantity;
        oldIndex = this.shelfHelperList.indexOf(eachItem);
        eachItem.quantity = toGet.quantity;
        found = true;
        break;
      }
    }
    if (!found) {
      this.shelfHelperList.push(toGet);
    }
    this.storage.set('shelfHelperList',this.shelfHelperList)
    .then()
    .catch(
      (err) => {
        if (!found) {
          this.shelfHelperList.splice(this.shelfHelperList.indexOf(toGet),1);
        }
        else {
          this.shelfHelperList[oldIndex].quantity = oldQuantity;
        }
      }
    );
  }

  public wipeStorage() : Promise<string> {
    return this.storage.remove('shelfHelperList')
    .then(
      () => {
        return "SUCCESS";
      }
    )
    .catch(
      (err) => {
        return "ERROR";
      }
    );
  }

}
