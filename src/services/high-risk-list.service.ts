import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

import { HighRiskItem } from '../assets/models/high-risk-item.model';


@Injectable()
export class HighRiskListService {

  highRiskList: HighRiskItem [];

  constructor(private storage: Storage,
              private file: File) {}

  addItem(item: HighRiskItem) {
    this.highRiskList.push(item);
    this.storage.set('highRiskList',this.highRiskList)
    .then(
      // REMINDER: Push to server.
    )
    .catch(
      (err) => {
        console.log(err);
        this.highRiskList.splice(this.highRiskList.indexOf(item,1),1);
      }
    );
  }

  removeItem(index: number) {
    const itemSave: HighRiskItem = this.highRiskList.slice(index, index + 1)[0];
    this.highRiskList.splice(index, 1);
    this.storage.set('shelfHelperList',this.highRiskList)
    .then(
      // REMINDER: Push to server.
    )
    .catch(
      (err) => {
        console.log(err);
        this.highRiskList.push(itemSave);
      }
    )
  }

  fetchList() {
    return this.storage.get('highRiskList')
    .then(
      (list: HighRiskItem []) => {
        this.highRiskList = list != null ? list: [];
        return this.highRiskList;
      }
    )
    .catch(
      (err) => {
        console.log(err);
      }
    )
  }


}
