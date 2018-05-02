import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

import { ToGetItem } from '../assets/models/to-get-item.model';


@Injectable()
export class ShelfHelperService {

  shelfHelperList: ToGetItem [];

  constructor(private storage: Storage) {}

  public addItem(item: ToGetItem) {
    let found = false, newIndex: number = 0, oldItemQuantity: number;
    let indexByUPC = this.shelfHelperList.map(function(it) { return it.item.upc }).indexOf(item.item.upc);
    if (indexByUPC == -1) {
      newIndex = this.shelfHelperList.push(item);
      newIndex--;
    }
    else {
      oldItemQuantity = this.shelfHelperList[indexByUPC].quantity;
      this.shelfHelperList[indexByUPC].quantity = Number(this.shelfHelperList[indexByUPC].quantity) + Number(item.quantity);
    }
    this.storage.set('shelfHelperList',this.shelfHelperList)
    .then()
    .catch(
      (err) => {
        if (indexByUPC == -1) {
          this.shelfHelperList.splice(newIndex,1);
        }
        else {
          this.shelfHelperList[indexByUPC].quantity = oldItemQuantity;
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

  public updateItem(toGet: ToGetItem, index: number, oldQuantity: number) : Promise<string> {
    this.shelfHelperList[index].quantity = toGet.quantity;
    console.log("shelfHelperList: " + JSON.stringify(this.shelfHelperList) + " index: " + index + " oldQuantity: " + oldQuantity);
    return this.storage.set('shelfHelperList',this.shelfHelperList)
    .then(
      () => { return "SUCCESS"; }
    )
    .catch(
      (err) => {
        this.shelfHelperList[index].quantity = oldQuantity;
        return "ERROR";
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
