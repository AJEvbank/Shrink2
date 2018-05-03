import { HTTP, HTTPResponse } from '@ionic-native/http';
import { Injectable } from '@angular/core';

import { Accessor } from '../../../Accessor';

import { ItemRecord } from '../assets/models/item-record.model';
import { ItemCollection } from '../assets/models/item-collection.model';
import { Notification } from '../assets/models/notification.model';
import { ShrinkAggregate } from '../assets/models/shrink-agreggate.model';
import { Throwaway } from '../assets/models/throwaway.model';

import moment from 'moment';

import { LogHandler } from '../assets/helpers/LogHandler';


@Injectable()
export class AWSCommService {

  private access = new Accessor();

  private logger: LogHandler = new LogHandler("AWSCommService");

  constructor(private http: HTTP) {

  }

  // Generic http request functions return Promise<HTTPResponse>.

  private put(functionURL: string, body: any) : Promise<HTTPResponse> {
    this.logger.logURLInfo(this.access.base + functionURL, body, "PUT");

    this.http.setDataSerializer("json");

    return this.http.put(this.access.base + functionURL, body, {});
  }

  private get(functionURL: string) : Promise<HTTPResponse> {
    this.logger.logURLInfo(this.access.base + functionURL, null, "GET");

    return this.http.get(this.access.base + functionURL, {}, {});
  }

  private delete(functionURL: string, body: any) : Promise<HTTPResponse> {
    this.logger.logURLInfo(this.access.base + functionURL, body, "DELETE");

    this.http.setDataSerializer("json");

    return this.http.delete(this.access.base + functionURL, body, {});
  }


  // Specific requests return a Promise<(desired data type here)>.

  public AWSgetupc(upc: string) : Promise<{item: ItemRecord, message: string}> {
    return this.get(this.access.upcFunction + upc)
    .then(
      (response) => {
        this.logger.logCont(response,"AWSgetupc");
        let resJSON = JSON.parse(response.data);
        if (resJSON.Items == undefined) {
          return {item: null, message: "UNDEFINED"};
        }
        else if(resJSON.Items[0].name != undefined){
          return {item: new ItemRecord(upc, resJSON.Items[0].name, resJSON.Items[0].highRisk), message: "SUCCESS"};
        }else{
          return {item: null, message: "EMPTY"};
        }
    })
    .catch((err) => {
      this.logger.logErr(err,"AWSgetupc");
      return {item: null, message: "ERROR"};
    });
  }

  public AWSupdateItemRecord(item: ItemRecord) : Promise<{item: ItemRecord, message: string}> {
    return this.put(this.access.updateItemRecordFunction + item.upc, {"name": item.name, "highRisk": item.isHighRisk})
    .then(
      (response) => {
        this.logger.logCont(response,"AWSupdateItemRecord");
        let updateItem = JSON.parse(response.data);
        if (updateItem.upc.upcId == undefined) {
          return {item: null, message: "UNDEFINED"};
        }
        if (item.upc != updateItem.upc.upcId) {
          return {item: null, message: "ERROR"};
        } else {
          return {item: new ItemRecord(updateItem.upc.upcId, updateItem.upc.name, updateItem.upc.highRisk), message: "SUCCESS"};
        }
      }
    )
    .catch(
      (err) => {
        this.logger.logErr(err,"AWSupdateItemRecord");
        return {item: null, message: "ERROR"};
      }
    )
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
    .then(
      (response) => {
        this.logger.logCont(response,"AWScreateNotification");
        let resJSON = JSON.parse(response.data);
        if(resJSON.notification == undefined) {
          return "UNDEFINED";
        }
        else {
          return "SUCCESS";
        }
      }
    )
    .catch(
      (err) => {
        this.logger.logErr(err,"AWScreateNotification");
        return "ERROR";
      }
    );
  }

  public AWSPermanentDeleteNotification(Id: string) : Promise<string> {
    return this.delete(this.access.notificationFunction + this.access.notificationId + Id, {Id: Id})
    .then(
      (response) => {
        this.logger.logCont(response,"AWSPermanentDeleteNotification");
        let resJSON = JSON.parse(response.data);
        if (resJSON.notification.Id == Id) {
          return "SUCCESS";
        }
        else {
          return "ERROR";
        }
      }
    )
    .catch(
      (err) => {
        this.logger.logErr(err,"AWSPermanentDeleteNotification");
        return "ERROR";
      }
    );
  }

  public AWSFetchTodaysNotifications() : Promise<{notifications: Notification[], message: string}> {
    let today = moment((new Date()).valueOf()).format("YYYY/MM/DDTHH:mm:ss");
    return this.get(this.access.notificationFunction + this.access.notificationRetrieval + today)
    .then(
      (response) => {
        this.logger.logCont(response,"AWSFetchTodaysNotifications");
        let resJSON = JSON.parse(response.data);
        if(resJSON == undefined || resJSON.Items == undefined){
          return {notifications: [], message: "UNDEFINED"};
        }
        else if(resJSON.Items.length == 0){
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
    })
    .catch((err) => {
      this.logger.logErr(err,"AWSFetchTodaysNotifications");
      return {notifications: [], message: "ERROR"};
    })
  }

  public AWSCreateThrowaway(throwaway: Throwaway) : Promise<string> { 
    let info = {
      "quantity": throwaway.item.quantity,
      "disposalDate": throwaway.dateOfDiscard,
      "unitPrice": throwaway.item.unitPrice,
      "upc": throwaway.item.item.upc
    };
    return this.put(this.access.throwawayFunction, info)
    .then(
      (response) => {
        this.logger.logCont(response,"AWSCreateThrowaway");
        let resJSON = JSON.parse(response.data);
        if (resJSON.notification == undefined) {
          return "ERROR";
        }
        else {
          return "SUCCESS";
        }
      }
    )
    .catch(
      (err) => {
        this.logger.logErr(err,"AWSCreateThrowaway");
        return "ERROR";
      }
    );
  }

  public AWSFetchShrinkList() : Promise<ShrinkAggregate[]> {
    return this.get(this.access.shrinkFunction)
    .then(
      (response) => {
        this.logger.logCont(response,"AWSFetchShrinkList");
        let resJSON = response.data.json();
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
    });
  }

  public AWSFetchDateRangeNotifications(from: string, to: string) : Promise<{notifications: Notification [], message: string}> {
    let urlString: string = (from == to) ? this.access.notificationFunction + this.access.notificationRetrieval + from
                                         : this.access.notificationFunction + this.access.fromDate + from + this.access.toDate + to;
    return this.get(urlString)
    .then(
      (response) => {
        this.logger.logCont(response,"AWSFetchDateRangeNotifications");
        let resJSON = JSON.parse(response.data);
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
    )
    .catch(
      (err) => {
        this.logger.logErr(err,"AWSFetchDateRangeNotifications");
        return {notifications: [], message: "ERROR"};
      }
    )
  }

  public shoutBack() : void {
    console.log("Using the device service.");
    return;
  }

  public AWSFetchHighRiskList() : Promise<{list: ItemRecord[], message: string}> {
    return this.get(this.access.highRiskListFunction)
    .then(
      (response) => {
        this.logger.logCont(response,"AWSFetchHighRiskList");
        let resJSON = JSON.parse(response.data);
        let highRiskList: ItemRecord[] = [];
        let message: string = "";
        if(resJSON == undefined || resJSON.Items == undefined){
          message = "ERROR";
        }
        else if(resJSON.Items.length == 0){
          message = "EMPTY";
        }
        else{
          for(let item of resJSON.Items) {
            let newItem = new ItemRecord(item.upc,item.name,item.isHighRisk);
            highRiskList.push(newItem);
          }
        }
        return {list: highRiskList, message: message};
    })
    .catch((err) => {
      this.logger.logErr(err,"AWSFetchHighRiskList");
      return {list: [], message: "ERROR"};
    })
  }

  public AWSGetLossOverTime(dateRangeStart: Date, dateRangeEnd: Date, selectionType: string, upc?: string){

  }

}
