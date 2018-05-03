import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';

import { Accessor } from '../../../Accessor';

import { ItemRecord } from '../assets/models/item-record.model';
import { ItemCollection } from '../assets/models/item-collection.model';
import { Notification } from '../assets/models/notification.model';
import { ShrinkAggregate } from '../assets/models/shrink-agreggate.model';
import { Throwaway } from '../assets/models/throwaway.model';

import { LogHandler } from '../assets/helpers/LogHandler';

import moment from 'moment';

@Injectable()
export class AWSCommBrowserService {

  private access = new Accessor();

  private logger: LogHandler = new LogHandler("AWSCommBrowserService");

  constructor(private http: Http) {

  }

  // Generic http request functions return Promise<HTTPResponse>.

  private put(functionURL: string, body: any) : Observable<Response> {
    this.logger.logURLInfo(this.access.base + functionURL, body, "PUT");
    return this.http.put(this.access.base + functionURL, body);
  }

  private get(functionURL: string) : Observable<Response> {
    this.logger.logURLInfo(this.access.base + functionURL, null, "GET");
    return this.http.get(this.access.base + functionURL);
  }

  private delete(functionURL: string, body: any) : Observable<Response> {
    this.logger.logURLInfo(this.access.base + functionURL, body, "DELETE");
    return this.http.delete(this.access.base + functionURL,{});
  }

  // Specific requests return a Promise<(desired data type here)>.

  public AWSgetupc(upc: string) : Promise<{item: ItemRecord, message: string}> {
    return this.get(this.access.upcFunction + upc)
    .map(
      (response) => {
        this.logger.logCont(response,"AWSgetupc");
        let resJSON = response.json();
        if (resJSON.Items == undefined) {
          return {item: null, message: "ERROR"};
        }
        else if(resJSON.Items.length > 0) {
          let newItemA = new ItemRecord(upc, resJSON.Items[0].name, resJSON.Items[0].highRisk);
          return {item: newItemA, message: "SUCCESS"};;
        }
        else {
          let newItemC = new ItemRecord(upc, "EMPTY");
          return {item: null, message: "EMPTY"};;
        }
      }).toPromise<{item: ItemRecord, message: string}>();
  }

  public AWSupdateItemRecord(item: ItemRecord) : Promise<{item: ItemRecord, message: string}> {
    return this.put(this.access.updateItemRecordFunction + item.upc, {"name": item.name, "highRisk": item.isHighRisk})
    .map(
      (response) => {
        this.logger.logCont(response,"AWSupdateItemRecord");
        let resJSON = response.json();
        if(resJSON.upc == undefined) {
          return {item: new ItemRecord(item.upc, "ERROR"), message: "ERROR"};
        }
        else{
          let updateItem = resJSON.upc;
          return {item: new ItemRecord(updateItem.upcId, updateItem.name, updateItem.highRisk), message: "SUCCESS"};
      }
    }).toPromise<{item: ItemRecord, message: string}>();
  }

  public AWScreateNotification(notification: Notification) : Promise<string> {
    return this.put(this.access.notificationFunction, {
                                                        "item" :
                                                        {
                                                            "upc" : notification.item.item.upc,
                                                            "quantity" : notification.item.quantity,
                                                            "unitPrice" : notification.item.unitPrice
                                                        },
                                                        "sellByDate" : notification.sellByDate.toString(),
                                                        "daysPrior" : notification.daysPrior,
                                                        "deliveryOption" : notification.deliveryOption,
                                                        "dateOfCreation" : notification.dateOfCreation,
                                                        "memo" : notification.memo,
                                                        "Id" : notification.Id
                                                      }
    )
    .map(
      (response) => {
        this.logger.logCont(response,"AWScreateNotification");
        let resJSON = response.json();
        if(resJSON.notification == undefined) {
          return "UNDEFINED";
        }
        else {
          return "SUCCESS";
        }
      }
    ).toPromise<string>();
  }

  public AWSFetchTodaysNotifications() : Promise<{notifications: Notification[], message: string}> {
    let today = moment((new Date()).valueOf()).format("YYYY-MM-DD");
    return this.get(this.access.notificationFunction + this.access.notificationRetrieval + today)
    .map(
      (response) => {
        this.logger.logCont(response,"AWSFetchTodaysNotifications");
        let resJSON = response.json();
        if(resJSON.Items == undefined){
          return {notifications: [], message: "UNDEFINED"};
        }
        else if(resJSON.Items.length <= 0){
          return {notifications: [], message: "EMPTY"};
        }
        else{
          let todaysNotifs: Notification[] = [];
          for(let res of resJSON.Items) {
            let itemCollection = new ItemCollection(new ItemRecord(res.upc, res.name, res.highRisk), res.quantity, res.unitPrice);
            todaysNotifs.push(new Notification(itemCollection, res.sellByDate, res.daysPrior, res.deliveryOption, res.memo, res.Id));
          }
          return {notifications: todaysNotifs, message: "SUCCESS"};
        }
    }).toPromise<{notifications: Notification[], message: string}>();
  }

  public AWSPermanentDeleteNotification(Id: string) : Promise<string>{
    return this.delete(this.access.notificationFunction + this.access.notificationId + Id, {Id: Id})
    .map(
      (response) => {
        this.logger.logCont(response,"AWSPermanentDeleteNotification");
        let resJSON = response.json();
        if (resJSON.notification.Id == Id) {
          return "SUCCESS";
        }
        else {
          return "ERROR";
        }
      }
    ).toPromise<string>();
  }

  public AWSCreateThrowaway(throwaway: Throwaway) : Promise<string> {
    let info = {
      "quantity": throwaway.item.quantity,
      "disposalDate": throwaway.dateOfDiscard,
      "unitPrice": throwaway.item.unitPrice,
      "upc": throwaway.item.item.upc
    };
    return this.put(this.access.throwawayFunction, info)
    .map(
      (response) => {
        this.logger.logCont(response,"AWSCreateThrowaway");
        let resJSON = response.json();
        if (resJSON.notification == undefined) { // What property is undefined?
          return "ERROR";
        }
        else {
          return "SUCCESS";
        }
      }
    ).toPromise<string>();
  }

  public AWSFetchShrinkList() : Promise<ShrinkAggregate[]> {
    return this.get(this.access.shrinkFunction)
    .map(
      (response) => {
        this.logger.logCont(response,"AWSFetchShrinkList");
        let resJSON = response.json();
        if(resJSON == undefined){
          return [];
        }
        else{
          let result: ShrinkAggregate[] = [];
          for(let item of resJSON.Items){
            result.push(new ShrinkAggregate(item.upcId, ((item.name == undefined || item.name == "") ? "Blank Name": item.name),
                                            item.totalShrink, item.highRisk));
          }
          return result;
        }
    }).toPromise<ShrinkAggregate[]>();
  }

  public AWSFetchDateRangeNotifications(from: string, to: string) : Promise<{notifications: Notification [], message: string}> {
    let urlString: string = (from == to) ? this.access.notificationFunction + this.access.notificationRetrieval + from
                                         : this.access.notificationFunction + this.access.fromDate + from + this.access.toDate + to;
    return this.get(urlString)
    .map(
      (response) => {
        this.logger.logCont(response,"AWSFetchDateRangeNotifications");
        let resJSON = response.json();
        if(resJSON.Items == undefined){
          return {notifications: [], message: "UNDEFINED"};
        }
        else if(resJSON.Items.length <= 0){
          return {notifications: [], message: "EMPTY"};
        }
        else{
          let requestedNotifs: Notification[] = [];
          for(let res of resJSON.Items) {
            let itemCollection = new ItemCollection(new ItemRecord(res.upc, res.name, res.highRisk), res.quantity, res.unitPrice);
            requestedNotifs.push(new Notification(itemCollection, res.sellByDate, res.daysPrior, res.deliveryOption, res.memo, res.Id));
          }
          return {notifications: requestedNotifs, message: "SUCCESS"};
        }
      }
    ).toPromise<{notifications: Notification [], message: string}>();
  }

  public shoutBack() : void {
    console.log("Using the browser service.");
    return;
  }

  public AWSFetchHighRiskList() : Promise<{list: ItemRecord[], message: string}> {
    return this.get(this.access.highRiskListFunction)
    .map(
      (response) => {
        this.logger.logCont(response,"AWSFetchHighRiskList");
        let resJSON = response.json();
        let highRiskList: ItemRecord[] = [];
        let message: string = "";
        if(resJSON.Items == undefined) {
          message = "UNDEFINED";
        }
        else if (resJSON.Items.length == 0) {
          message = "EMPTY";
        }
        else {
          for(let item of resJSON.Items) {
            let newItem = new ItemRecord(item.upc,item.name,item.isHighRisk);
            highRiskList.push(newItem);
          }
          message = "SUCCESS";
        }
        return {list: highRiskList, message: message};
      }
    ).toPromise<{list: ItemRecord[], message: string}>();
  }

  public AWSGetLossOverTime(dateRangeStart: Date, dateRangeEnd: Date, selectionType: string, upc?: string){
    //Probably cast to shrinkAggregate and return a list. Don't need much else.
  }
}
