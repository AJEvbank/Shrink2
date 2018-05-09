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
        console.log("resJSON: " + JSON.stringify(resJSON));
        if (resJSON.upcnumber === upc) {
          let newName = this.getNameFromJSON(resJSON);
          let newItemA = new ItemRecord(resJSON.upcnumber, newName);
          return {item: newItemA, message: "FOUND"};
        }
        else if (resJSON.Error == "upcId was not found in DynamoDB or upcdatabase") {
          let newItemB = new ItemRecord(upc, "(Add New Item Name Here)");
          return {item: newItemB, message: "EMPTY"};
        }
        else if (resJSON.Items == undefined || resJSON.Items.length == 0) {
          return {item: null, message: "UNDEFINED"};
        }
        else {
          let newItemC = new ItemRecord(upc, resJSON.Items[0].name, resJSON.Items[0].highRisk);
          return {item: newItemC, message: "SUCCESS"};
        }
      }).toPromise<{item: ItemRecord, message: string}>();
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
      return this.get(pastRequest).map((response) => {
          //Debug and var
          let resJSON = response.json();
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

      }).toPromise<number[]>()
      .then((pastResults) => {
        //This is the future request. Append to the results we got from the previous request.
        return this.get(futureRequest).map((response) => {
          //Debug and var
          let resJSON = response.json();
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
        }).toPromise<number[]>();
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
      return this.get(fullRequest).map((response) => {
        let resJSON = response.json();
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
      }).toPromise<number[]>();
    }

  }

}
