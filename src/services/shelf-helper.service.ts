import { ToGetItem } from '../assets/models/to-get-item.model';

import { File } from '@ionic-native/file';
import { Storage } from '@ionic/storage';
import { Injectable, OnInit } from '@angular/core';

@Injectable()
export class ShelfHelperService {

  shelfHelperList: ToGetItem [];
  toGetItem: ToGetItem;
  index: number;

  constructor(private file: File,
              private storage: Storage) {

  }

  addItem(item: ToGetItem) {
    this.shelfHelperList.push(item);
    this.storage.set('shelfHelperList',this.shelfHelperList)
    .then()
    .catch(
      (err) => {
        console.log(err);
        this.shelfHelperList.splice(this.shelfHelperList.indexOf(item),1);
      }
    );
  }

  removeItem(index: number) {
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
}
