import { Injectable } from '@angular/core';

import { ItemRecord } from '../assets/models/item-record.model';

import { AWSCommBrowserService } from '../services/AWSCommBrowser.service';
import { AWSCommService } from '../services/AWSComm.service';


@Injectable()
export class HighRiskListService {

  private highRiskList: ItemRecord [];
  private listLoaded = false;

  constructor(private AWSCommBrowser: AWSCommBrowserService,
              private AWSCommMobile: AWSCommService) {
    this.highRiskList = [];
  }

  public ToggleHighRisk(oldItem: ItemRecord, toggle: boolean) : Promise<ItemRecord> {
    //Choose appropriate comm tool.
    let AWSComm = (window.location.hostname == "localhost") ? this.AWSCommBrowser : this.AWSCommMobile;
    //Make server request.
    return AWSComm.AWSupdateItemRecord(new ItemRecord(oldItem.upc, oldItem.name, toggle))
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
      return itemResponse;
    })
    .catch((err) => {
      console.log(err);
      return oldItem;
    });
  }

  // public FetchList() : Promise<any>{
  //
  // }

  public GetList() : ItemRecord[] {
    return this.highRiskList.slice();
  }

  // public isListLoaded() : boolean {
  //   return this.listLoaded;
  // }


}
