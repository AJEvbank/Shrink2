import { Injectable } from '@angular/core';

import { ItemRecord } from '../assets/models/item-record.model';

import { AWSCommBrowserService } from '../services/AWSCommBrowser.service';
import { AWSCommService } from '../services/AWSComm.service';


@Injectable()
export class HighRiskListService {

  private highRiskList: ItemRecord [] = [];
  private listLoaded = false;

  private AWSComm: AWSCommBrowserService | AWSCommService;

  constructor(private AWSCommBrowser: AWSCommBrowserService,
              private AWSCommMobile: AWSCommService) {
    //Choose appropriate comm tool.
    this.AWSComm = (window.location.hostname == "localhost") ? this.AWSCommBrowser : this.AWSCommMobile;
  }

  public ToggleHighRisk(oldItem: ItemRecord, toggle: boolean) : Promise<{item: ItemRecord, message: string}> {
    //Make server request.
    return this.AWSComm.AWSupdateItemRecord(new ItemRecord(oldItem.upc, oldItem.name, toggle))
    .then(
      (itemResponse) => {
      if (itemResponse.message == "SUCCESS") {
        let index = this.highRiskList.indexOf(itemResponse.item);
        if(itemResponse.item.isHighRisk){
          //Only add the item if it isn't already there.\
          if(index == -1){
            this.highRiskList.push(itemResponse.item);
          }
        }
        else{
          //Same principle here.
          if(index > -1){
            this.highRiskList.splice(index, 1);
          }
        }
        return {item: itemResponse.item, message: itemResponse.message};
      }
    })
    .catch((err) => {
      console.log(err);
      return {item: oldItem, message: "ERROR"};
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
