import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

import { ToGetItem } from '../assets/models/to-get-item.model';

import { LogHandler } from '../assets/helpers/LogHandler';

@Injectable()
export class ShelfHelperService {

  shelfHelperList: ToGetItem [];

  logger: LogHandler = new LogHandler("ShelfHelperService");

  constructor(private storage: Storage) {}

  public addItem(item: ToGetItem) : Promise<string> {
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
    return this.storage.set('shelfHelperList',this.shelfHelperList)
    .then(
      (data) => {
        this.logger.logCont(data,"addItem");
        return "SUCCESS";
      }
    )
    .catch(
      (err) => {
        this.logger.logErr(err,"addItem");
        if (indexByUPC == -1) {
          this.shelfHelperList.splice(newIndex,1);
        }
        else {
          this.shelfHelperList[indexByUPC].quantity = oldItemQuantity;
        }
        return "ERROR";
      }
    );
  }

  public removeItem(index: number) : Promise<string> {
    const itemSave: ToGetItem = this.shelfHelperList.slice(index,index + 1)[0];
    this.shelfHelperList.splice(index, 1);
    return this.storage.set('shelfHelperList',this.shelfHelperList)
    .then(
      (data) => {
        this.logger.logCont(data,"removeItem");
        return "SUCCESS";
      }
    )
    .catch(
      (err) => {
        this.logger.logErr(err,"removeItem");
        this.addItem(itemSave)
        .then(
          (data) => {
            this.logger.logCont(data,"removeItem");
            return "FAILED";
          }
        )
        .catch(
          (err) => {
            this.logger.logErr(err,"removeItem");
            return "ERROR";
          }
        );
        return "ERROR";
      }
    )
  };

  public fetchList() : Promise<ToGetItem[]> {
    return this.storage.get('shelfHelperList')
    .then(
      (list: ToGetItem []) => {
        this.logger.logCont(list,"fetchList");
        this.shelfHelperList = list != null ? list: [];
        return this.shelfHelperList;
      }
    )
    .catch(
      (err) => {
        this.logger.logErr(err,"fetchList");
        return this.shelfHelperList = [];
      }
    )
  }

  public loadList() : ToGetItem[] {
    return this.shelfHelperList.slice();
  }

  public updateItem(toGet: ToGetItem, index: number, oldQuantity: number) : Promise<string> {
    this.shelfHelperList[index].quantity = toGet.quantity;
    return this.storage.set('shelfHelperList',this.shelfHelperList)
    .then(
      (data) => {
        this.logger.logCont(data,"updateItem");
        return "SUCCESS";
      }
    )
    .catch(
      (err) => {
        this.logger.logErr(err,"updateItem");
        this.shelfHelperList[index].quantity = oldQuantity;
        return "ERROR";
      }
    );
  }

  public wipeStorage() : Promise<string> {
    return this.storage.remove('shelfHelperList')
    .then(
      (data) => {
        this.logger.logCont(data,"wipeStorage");
        return "SUCCESS";
      }
    )
    .catch(
      (err) => {
        this.logger.logErr(err,"wipeStorage");
        return "ERROR";
      }
    );
  }

}
