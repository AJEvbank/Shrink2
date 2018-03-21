import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

import { ToGetItem } from '../assets/models/to-get-item.model';
import { ItemRecord } from '../assets/models/item-record.model';


@Injectable()
export class ShelfHelperService {

  shelfHelperList: ToGetItem [];

  constructor(private storage: Storage) {

  }

  public addItem(item: ToGetItem) {
    let found = false, oldQuantity: number, oldIndex: number;
    for(let eachItem of this.shelfHelperList) {
      console.log(item.item.upc + " ? " + eachItem.item.upc);
      if (item.item.upc == eachItem.item.upc) {
        oldQuantity = eachItem.quantity;
        oldIndex = this.shelfHelperList.indexOf(eachItem);
        eachItem.quantity += item.quantity;
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
        console.log(err);
        if (!found) {
          this.shelfHelperList.splice(this.shelfHelperList.indexOf(item),1);
        }
        else {
          this.shelfHelperList[oldIndex].quantity = oldQuantity;
        }
      }
    );
  }

  public removeItem(index: number) {
    const itemSave: ToGetItem = this.shelfHelperList.slice(index,index + 1)[0];
    this.shelfHelperList.splice(index, 1);
    this.storage.set('shelfHelperList',this.shelfHelperList)
    .then()
    .catch(
      (err) => {
        console.log(err);
        this.addItem(itemSave);
      }
    )
  };

  public fetchList() {
    return this.storage.get('shelfHelperList')
    .then(
      (list: ToGetItem []) => {
        this.shelfHelperList = list != null ? list: [];
        return this.shelfHelperList;
      }
    )
    .catch(
      (err) => {
        console.log(err);
      }
    )
  }

  public loadList() {
    return this.shelfHelperList.slice();
  }
}
