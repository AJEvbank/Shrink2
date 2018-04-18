import { HTTP, HTTPResponse } from '@ionic-native/http';
import { Injectable } from '@angular/core';

import { Accessor } from '../../../Accessor';

import { ItemRecord } from '../assets/models/item-record.model';
import { ItemCollection } from '../assets/models/item-collection.model';
import { Notification } from '../assets/models/notification.model';
import { ShrinkAggregate } from '../assets/models/shrink-agreggate.model';
import { Throwaway } from '../assets/models/throwaway.model';




@Injectable()
export class AWSCommService {

  access = new Accessor();

  constructor(private http: HTTP) {

  }

  // Generic http request functions return Promise<HTTPResponse>.

  private put(functionURL: string, body: any) : Promise<HTTPResponse> {

    this.http.setDataSerializer("json");

    return this.http.put(this.access.base + functionURL, body, {});
  }

  private get(functionURL: string) : Promise<HTTPResponse> {
    return this.http.get(this.access.base + functionURL, {}, {});
  }

  private delete(functionURL: string, body: any) : Promise<HTTPResponse> {
    console.log("Service delete called.");
    this.http.setDataSerializer("json");

    return this.http.delete(this.access.base + functionURL, body, {});
  }


  // Specific requests return a Promise<(desired data type here)>.

  public AWSgetupc(upc: string) : Promise<ItemRecord> {
    return this.get(this.access.upcFunction + upc)
    .then((response) => {
      let resJSON = JSON.parse(response.data);
      console.log("resJSON on device service: " + JSON.stringify(resJSON));
      if (resJSON.Items == undefined) {
        console.log("Undefined Items[] from server! ");
        return new ItemRecord(upc, "ERROR");
      }
      else if(resJSON.Items[0].name != undefined){
        console.log("Got valid record back!");
        return new ItemRecord(upc, resJSON.Items[0].name, resJSON.Items[0].highRisk);
      }else{
        console.log("Got empty record back!");
        return new ItemRecord(upc, "EMPTY");
      }
    })
    .catch((err) => {
      console.log("Caught error from get: " + JSON.stringify(err));
      return new ItemRecord(upc, "ERROR");
    });
  }

  public AWSupdateItemRecord(item: ItemRecord) : Promise<{item: ItemRecord, message: string}> {
    return this.put(this.access.updateItemRecordFunction + item.upc, {"name": item.name, "highRisk": item.isHighRisk})
    .then(
      (response) => {
        let resJSON = JSON.parse(response.data);
        console.log("Got the updated record back! " + JSON.stringify(response));
        console.log("resJSON.upc.upcId = " + JSON.stringify(resJSON.upc.upcId));
        if (resJSON.upc.upcId == undefined) {
          console.log("Backend shenanigans happened!");
          return {item: null, message: "ERROR"};
        }
        let updateItem = resJSON;
        if (item.upc != updateItem.upc.upcId) {
          console.log(item.upc + " != " + updateItem.upc.upcId + ": Something went horribly wrong!");
          return {item: null, message: "ERROR"};
        } else {
          return {item: new ItemRecord(updateItem.upc.upcId, updateItem.upc.name, updateItem.upc.highRisk), message: "SUCCESS"};
        }
      }
    )
    .catch(
      (err) => {
        console.log("Error on http request: " + JSON.stringify(err));
        return {item: null, message: "ERROR"};
      }
    )
  }

  public AWScreateNotification(notification: Notification) : Promise<string> {
    console.log("Notification: " + JSON.stringify(notification));
    return this.put(this.access.notificationFunction, {
                                                        "item" :
                                                        {
                                                            "item" :
                                                            {
                                                                "upc" : notification.item.item.upc,
                                                                "name" : notification.item.item.name,
                                                                "isHighRisk" :notification.item.item.isHighRisk
                                                            },
                                                            "quantity" : notification.item.quantity,
                                                            "unitPrice" : notification.item.unitPrice
                                                        },
                                                        "sellByDate" : notification.sellByDate.toString(),
                                                        "daysPrior" : notification.daysPrior,
                                                        "deliveryOption" : notification.deliveryOption,
                                                        "dateOfCreation" : notification.dateOfCreation.toString(),
                                                        "memo" : notification.memo,
                                                        "Id" : notification.Id
                                                      }
    )
    .then(
      (response) => {
        let resJSON = JSON.parse(response.data);
        if(resJSON.notification == undefined) {
          console.log("Undefined response from server: " + JSON.stringify(resJSON));
          return "UNDEFINED";
        }
        else {
          console.log("Response from server: " + JSON.stringify(resJSON));
          return "SUCCESS";
        }
      }
    )
    .catch(
      (err) => {
        return "ERROR";
      }
    );
  }

  public AWSPermanentDeleteNotification(Id: string) : Promise<string>{
    console.log("In device comm service function.");
    return this.delete(this.access.notificationFunction + this.access.notificationId + Id, {Id: Id})
    .then(
      (response) => {
        let resJSON = JSON.parse(response.data);
        console.log("No error from delete(): " + JSON.stringify(response));
        console.log("resJSON: " + JSON.stringify(resJSON));
        if (resJSON.notification.Id == Id) {
          return "SUCCESS";
        }
        else {
          return "ERRORS";
        }
      }
    )
    .catch(
      (err) => {
        console.log("Error caught in AWSPermanentDeleteNotification(): " + err.json() + " :=> " + JSON.stringify(err));
        return "ERRORED";
      }
    );
  }

  public AWSFetchTodaysNotifications() : Promise<Notification[]> {
    console.log("Entered AWSFetchTodaysNotifications() via device service");
    let today = (new Date()).toLocaleString();
    console.log("today: " + today);
    return this.get(this.access.notificationFunction + this.access.notificationRetrieval + today)
    .then((response) => {
      let resJSON = JSON.parse(response.data);
      console.log("resJSON: " + JSON.stringify(resJSON));
      if(resJSON == undefined || resJSON.Items == undefined){
        console.log("Request returned undefined! Here's the response: " + JSON.stringify(response));
        return [];
      }
      else if(resJSON.Items.length == 0){
        console.log("Request did not find any due notifications. Here's the response: " + JSON.stringify(response));
        return [];
      }
      else{
        let todaysNotifs: Notification[] = [];
        for(let res of resJSON.Items) {
          let itemCollection = new ItemCollection(new ItemRecord(res.item.upc, res.item.name, res.item.isHighRisk), res.quantity, res.unitPrice);
          todaysNotifs.push(new Notification(itemCollection, res.sellByDate, res.daysPrior, res.deliveryOption, res.memo, res.Id));
        }
        console.log("Got back good response! Here it is mapped: ");
        console.log(todaysNotifs);
        return todaysNotifs;
      }
      //return [];
    })
    .catch((err) => {
      console.log("Caught error in AWSFetchTodaysNotifications(): " + JSON.stringify(err));
      console.log("Caught error in AWSFetchTodaysNotifications(): " + err.toString());
      return [];
    })
  }

  public AWSCreateThrowaway(throwaway: Throwaway) : Promise<string>{
    console.log("Creating throwaway: " + JSON.stringify(throwaway));
    let info = {
      "quantity": throwaway.item.quantity,
      "disposalDate": throwaway.dateOfDiscard,
      "unitPrice": throwaway.item.unitPrice,
      "item": {
        "name": throwaway.item.item.name,
        "isHighRisk": throwaway.item.item.isHighRisk,
        "upc": throwaway.item.item.upc
      }
    };
    console.log("Passing throwaway: " + JSON.stringify(info));
    return this.put(this.access.throwawayFunction, info)
    .then(
      (response) => {
        let resJSON = JSON.parse(response.data);
        console.log("Response from server: " + JSON.stringify(resJSON) + " :=> " + resJSON);
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
        console.log("Caught error from put: " + err.json() + " :=> " + JSON.stringify(err));
        return "ERROR";
      }
    );
  }

  public AWSFetchShrinkList() : Promise<ShrinkAggregate[]> {
    return this.get(this.access.shrinkFunction)
    .then((response) => {
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

  public AWSFetchDateRangeNotifications(from: string, to: string) : Promise<Notification []> {
    let urlString: string;
    console.log("(new Date(from)).toDateString(): " + (new Date(from)).toDateString());
    console.log("(new Date(to)).toDateString(): " + (new Date(to)).toDateString());
    if ((new Date(from)).toDateString() == (new Date(to)).toDateString()) {
      console.log("==");
      urlString = this.access.notificationFunction + this.access.notificationRetrieval + from;
    }
    else {
      console.log("!=");
      urlString = this.access.notificationFunction + this.access.fromDate + from + this.access.toDate + to;
    }
    return this.get(urlString)
    .then(
      (response) => {
        let resJSON = JSON.parse(response.data);
        if(resJSON.Items == undefined){
          console.log("Got back an undefined response! Here it is: " + JSON.stringify(resJSON));
          return [];
        }
        else if(resJSON.Items.length <= 0){
          console.log("No notifications for given day! Here's the response: " + JSON.stringify(resJSON));
          return [];
        }
        else{
          let requestedNotifs: Notification[] = [];
          for(let res of resJSON.Items) {
            let itemCollection = new ItemCollection(new ItemRecord(res.item.upc, res.item.name, res.item.isHighRisk), res.quantity, res.unitPrice);
            requestedNotifs.push(new Notification(itemCollection, res.sellByDate, res.daysPrior, res.deliveryOption, res.memo, res.Id));
          }
          console.log("Got back good response! Here it is mapped: " + JSON.stringify(requestedNotifs));
          return requestedNotifs;
        }
      }
    )
    .catch(
      (err) => {
        console.log("Caught error in AWSFetchDateRangeNotifications(): " + err.json() + " :=> " + JSON.stringify(err));
        return [];
      }
    )
  }

  public shoutBack() {
    console.log("This is the device service.");
  }

  public AWSFetchHighRiskList() : Promise<{list: ItemRecord[], message: string}> {
    console.log("Entered AWSFetchHighRiskList() via device service");
    return this.get(this.access.highRiskListFunction)
    .then((response) => {
      let resJSON = JSON.parse(response.data);
      console.log("resJSON: " + JSON.stringify(resJSON));
      let highRiskList: ItemRecord[] = [];
      let message: string = "";
      if(resJSON == undefined || resJSON.Items == undefined){
        console.log("Request returned undefined! Here's the response: " + JSON.stringify(response));
        message = "ERROR";
      }
      else if(resJSON.Items.length == 0){
        console.log("Request did not find any due notifications. Here's the response: " + JSON.stringify(response));
        message = "EMPTY";
      }
      else{
        for(let item of resJSON.Items) {
          let newItem = new ItemRecord(item.upc,item.name,item.isHighRisk);
          highRiskList.push(newItem);
        }
        console.log("Got back good response! Here it is mapped: ");
        console.log(highRiskList);
      }
      return {list: highRiskList, message: message};
    })
    .catch((err) => {
      console.log("Caught error in AWSFetchHighRiskList(): " + JSON.stringify(err));
      console.log("Caught error in AWSFetchHighRiskList(): " + err.json());
      return {list: [], message: "ERROR"};
    })
  }

}
