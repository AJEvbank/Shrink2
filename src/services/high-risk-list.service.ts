import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

import { ItemRecord } from '../assets/models/item-record.model';

import { AWSCommBrowserService } from '../services/AWSCommBrowser.service';


@Injectable()
export class HighRiskListService {

  private highRiskList: ItemRecord [];
  private listLoaded = false;

  constructor(private AWSCommBrowser: AWSCommBrowserService,) {
    this.highRiskList = [];
  }

  public ToggleHighRisk(item: ItemRecord, toggle: boolean) : Promise<ItemRecord> {
    return this.AWSCommBrowser.AWSupdateItemRecord(new ItemRecord(item.upc, item.name, toggle))
    .then((itemResponse) => {

      let index = this.highRiskList.indexOf(itemResponse);
      if(itemResponse.isHighRisk){
        //Only add the item if it isn't already there.\
        if(index == -1){
          this.highRiskList.push(itemResponse);
        }
      }
      else{
        //Same principle here.
        if(index > -1){
          this.highRiskList.splice(index, 1);
        }
      }
      return item;

    })
    .catch((err) => {
      console.log(err);
      return item;
    });
  }

  // public FetchList() : Promise<any>{
  //
  // }

  public GetList() : ItemRecord[] {
    return this.highRiskList.slice();
  }

  // public addItem(item: ItemRecord) {
  //   if (window.location.hostname == "localhost"){
  //     this.AWSCommBrowser.AWSupdateItemRecord()
  //   }
  //   if(this.highRiskList.indexOf(item) < 0){
  //     this.highRiskList.push(item);
  //     this.storage.set('highRiskList',this.highRiskList)
  //     .then(
  //
  //       // REMINDER: Push to server.
  //     )
  //     .catch(
  //       (err) => {
  //         console.log(err);
  //         this.highRiskList.splice(this.highRiskList.indexOf(item,1),1);
  //       }
  //     );
  //   }
  // }
  //
  // public removeItem(index: number) {
  //   const itemSave: ItemRecord = this.highRiskList.slice(index, index + 1)[0];
  //   this.highRiskList.splice(index, 1);
  //   this.storage.set('shelfHelperList',this.highRiskList)
  //   .then(
  //     // REMINDER: Push to server.
  //   )
  //   .catch(
  //     (err) => {
  //       console.log(err);
  //       this.highRiskList.push(itemSave);
  //     }
  //   )
  // }
  //
  // public getList() : ItemRecord[] {
  //   return this.highRiskList.slice();
  // }
  //
  // public isListLoaded() : boolean {
  //   return this.listLoaded;
  // }


}
