import { Injectable } from '@angular/core';

import { ItemRecord } from '../assets/models/item-record.model';

import { AWSCommBrowserService } from '../services/AWSCommBrowser.service';
import { AWSCommService } from '../services/AWSComm.service';

import { LogHandler } from '../assets/helpers/LogHandler';


@Injectable()
export class HighRiskListService {

  private highRiskList: ItemRecord [] = [];
  private listLoaded = false;

  private AWSComm: AWSCommBrowserService | AWSCommService;

  private logger: LogHandler = new LogHandler("HighRiskListService");

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
          this.logger.logCont(itemResponse,"ToggleHighRisk");
          let index = this.highRiskList.map(function (it) { return it.upc; }).indexOf(itemResponse.item.upc);
          console.log("index = " + index);
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
      this.logger.logErr(err,"ToggleHighRisk");
      return {item: oldItem, message: "ERROR"};
    });
  }

  public FetchList() : Promise<string> {
    return this.AWSComm.AWSFetchHighRiskList()
    .then(
      (data) => {
        this.logger.logCont(data,"FetchList");
        let rtrn: string;
        if(data.message == "UNDEFINED" || data.message == "ERROR") {
          rtrn = "ERROR";
        }
        else if (data.message == "EMPTY" || data.message == "SUCCESS") {
          this.listLoaded == true;
          rtrn = (data.message == "EMPTY") ? "EMPTY" : "SUCCESS";
          this.highRiskList = data.list.slice();
          this.listLoaded = true;
        }
        return rtrn;
      }
    )
    .catch(
      (err) => {
        this.logger.logErr(err,"FetchList");
        return "ERROR";
      }
    )
  }

  public GetList() : ItemRecord[] {
    return this.highRiskList.slice();
  }

  public isListLoaded() : boolean {
    return this.listLoaded;
  }


}
