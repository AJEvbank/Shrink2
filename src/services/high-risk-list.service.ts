import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

import { ItemRecord } from '../assets/models/item-record.model';


@Injectable()
export class HighRiskListService {

  private highRiskList: ItemRecord [];
  private listLoaded = false;

  constructor(private storage: Storage) {}

  public addItem(item: ItemRecord) {
    if(this.highRiskList.indexOf(item) < 0){
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
  }

  public removeItem(index: number) {
    const itemSave: ItemRecord = this.highRiskList.slice(index, index + 1)[0];
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

  public fetchList() : Promise<void> {
    return this.storage.get('highRiskList')
    .then(
      (list: ItemRecord []) => {
        this.highRiskList = list != null ? list: [];
        this.listLoaded = true;
      }
    )
    .catch(
      (err) => {
        console.log(err);
        this.highRiskList = [];
        this.listLoaded = true;
      }
    )
  }

  public getList() : ItemRecord[] {
    return this.highRiskList.slice();
  }

  public isListLoaded() : boolean {
    return this.listLoaded;
  }


}
