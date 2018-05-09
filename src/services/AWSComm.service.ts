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
        if (resJSON.upcnumber === upc) {
          let newName = this.getNameFromJSON(resJSON);
          let newItemA = new ItemRecord(resJSON.upcnumber, newName);
          return {item: newItemA, message: "FOUND"};
        }
        else if(resJSON.Error == "upcId was not found in DynamoDB or upcdatabase") {
          let newItemA = new ItemRecord(upc, "(Add New Item Name Here)");
          return {item: newItemA, message: "EMPTY"};
        }
        else if (resJSON.Items == undefined || resJSON.Items.length == 0) {
          return {item: null, message: "UNDEFINED"};
        }
        else {
          let newItemA = new ItemRecord(upc, resJSON.Items[0].name, resJSON.Items[0].highRisk);
          return {item: newItemA, message: "SUCCESS"};
        }
    })
    .catch((err) => {
      this.logger.logErr(err,"AWSgetupc");
      return {item: null, message: "ERROR"};
    });
  }

  private getNameFromJSON(genericObject: any) : string {
    if(genericObject.title !== undefined && genericObject.title.length > 2) {
      return genericObject.title.replace('"','');
    }
    else if(genericObject.alias !== undefined && genericObject.alias.length > 2) {
      return genericObject.alias.replace('"','');
    }
    else if(genericObject.description !== undefined && genericObject.description.length > 2) {
      return genericObject.description.replace('"','');
    }
    else if(genericObject.brand !== undefined && genericObject.brand.length > 2) {
      return genericObject.brand.replace('"','');
    }
    else {
      return "(Add New Item Name Here)";
    }
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
    let today = moment((new Date()).valueOf()).format("YYYY-MM-DD");
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
        let resJSON = JSON.parse(response.data);
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
        if(resJSON === undefined){
          message = "ERROR";
        }
        else if(resJSON.length == 0){
          message = "EMPTY";
        }
        else{
          for(let item of resJSON) {
            let newItem = new ItemRecord(item.upcId,item.name,item.highRisk);
            highRiskList.push(newItem);
          }
          message = "SUCCESS";
        }
        return {list: highRiskList, message: message};
    })
    .catch((err) => {
      this.logger.logErr(err,"AWSFetchHighRiskList");
      return {list: [], message: "ERROR"};
    })
  }

  public AWSGetLossOverTime(dateRangeStart: Date, dateRangeEnd: Date, selectionType: string, upc?: string) : Promise<number[]> {
    //Gotta construct the entire request.
    // let fullRequest = this.access.lossFunction;
    // fullRequest += this.access.lossFrom + dateRangeStart.toISOString();
    // fullRequest += this.access.lossTo + dateRangeEnd.toISOString();
    let request = this.access.lossFunction;
    let requestStart = this.access.lossFrom + dateRangeStart.toISOString();
    let requestEnd = this.access.lossTo + dateRangeEnd.toISOString();

    let op = ""; //Convert frontend op codes to the backend ones.
    switch(selectionType){
      case "SingleItem":{
        op = selectionType;
        break;
      }
      case "HighRiskList":{
        op = selectionType;
        break;
      }
      case "AllItems":{
        op = "AllItem";
        break;
      }
    }
    let requestOp = this.access.lossOperation + op;
    let requestUPC = "";
    if(selectionType == "SingleItem"){ //Add UPC code if necessary...
      requestUPC = this.access.lossUPC + upc;
    }

    //Need to calculate whether this will need to be future timeframe, past, or both... Joy...
    //Break down dates to the simple forms. This makes comparisons easier.
    //fullRequest += this.access.lossTimeframe + "past";
    let today = new Date();
    today = new Date((today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear());
    let todayString = (today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear();

    let start = new Date((dateRangeStart.getMonth()+1) + "/" + dateRangeStart.getDate() + "/" + dateRangeStart.getFullYear());
    let startString = (dateRangeStart.getMonth()+1) + "/" + dateRangeStart.getDate() + "/" + dateRangeStart.getFullYear();

    let end = new Date((dateRangeEnd.getMonth()+1) + "/" + dateRangeEnd.getDate() + "/" + dateRangeEnd.getFullYear());
    let endString = (dateRangeEnd.getMonth()+1) + "/" + dateRangeEnd.getDate() + "/" + dateRangeEnd.getFullYear();

    if(start <= today && end >= today){
      console.log("Found need for a double query!");
      //Gonna need some nested ASYNC. If I had more time I'd do this in parallel. But fuck this is the night before basically.
      requestStart = this.access.lossFrom + startString;
      requestEnd = this.access.lossTo + endString;
      let pastRequest = request + requestStart + (this.access.lossTo + todayString) + requestOp + requestUPC + this.access.lossTimeframe + "past";
      let futureRequest = request + (this.access.lossFrom + todayString) + requestEnd + requestOp + requestUPC + this.access.lossTimeframe + "future";
      //Gotta construct some queries.
      return this.get(pastRequest)
      .then((response) => {
          //Debug and var
          let resJSON = JSON.parse(response.data);
          this.logger.logCont(resJSON,"AWSGetLossOverTime[First Query]");
          if(resJSON.length === undefined || resJSON.length < 1){
            console.log("SOMETHING WENT WRONG! PAAAAAAAAAAAAANIC!");
            return [];
          }

          //Parse through every entry there.
          let aggregates = [];
          for(let i = 0; i < resJSON.length; i++){
            aggregates.push(parseFloat(resJSON[i]));
          }
          return aggregates;

      })
      .then((pastResults) => {
        //This is the future request. Append to the results we got from the previous request.
        return this.get(futureRequest)
        .then((response) => {
          //Debug and var
          let resJSON = JSON.parse(response.data);
          this.logger.logCont(resJSON,"AWSGetLossOverTime[Second Query]");
          if(resJSON.length === undefined || resJSON.length < 1){
            console.log("SOMETHING WENT WRONG! PAAAAAAAAAAAAANIC!");
            return [];
          }

          //Parse through every entry there. Append to previous results.
          let aggregates = pastResults;
          for(let i = 0; i < resJSON.length; i++){
            if(i === 0){
              aggregates[-1] += parseFloat(resJSON[i]);
              continue;
            }
            aggregates.push(parseFloat(resJSON[i]));
          }
          return aggregates;
        });
      });
    }
    else{ //The request will be made in here.
      //Just need one request.
      let requestTimeframe = "";
      if(start > today){
        console.log("Found need for a future query!");
        requestTimeframe = this.access.lossTimeframe + "future";

      }else{
        console.log("Found need for a past query!");
        requestTimeframe = this.access.lossTimeframe + "past";
      }
      //Construct final request
      let fullRequest = request + requestStart + requestEnd + requestOp + requestUPC + requestTimeframe;

      //We have that massive request. Let's do this shit.
      return this.get(fullRequest)
      .then((response) => {
        let resJSON = JSON.parse(response.data);
        this.logger.logCont(resJSON,"AWSGetLossOverTime");
        if(resJSON.length === undefined || resJSON.length < 1){
          console.log("SOMETHING WENT WRONG! PAAAAAAAAAAAAANIC!");
          return [];
        }
        //Parse through every entry there.
        let aggregates = [];
        for(let i = 0; i < resJSON.length; i++){
          aggregates.push(parseFloat(resJSON[i]));
        }
        return aggregates;
      });
    }

  }

}
