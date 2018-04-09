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


//import { uuid } from 'uuid/v1';

@Injectable()
export class AWSCommBrowserService {

  access = new Accessor();

  constructor(private http: Http) {

  }

  // Generic http request functions return Promise<HTTPResponse>.

  private put(functionURL: string, body: any) : Observable<Response> {
    return this.http.put(this.access.base + functionURL, body);
  }

  private get(functionURL: string) : Observable<Response> {
    return this.http.get(this.access.base + functionURL);
  }

  private delete(functionURL: string, body: any) : Observable<Response> {
    return this.http.delete(this.access.base + functionURL,{});
  }

  // Specific requests return a Promise<(desired data type here)>.

  public AWSgetupc(upc: string) : Promise<ItemRecord> {
    return this.get(this.access.upcFunction + upc).map((response) => {
      let resJSON = response.json();
      console.log(resJSON);
      if (resJSON.Items == undefined) {
      console.log("No Items[] on response!");
        let newItemB = new ItemRecord(upc, "ERROR");
        return newItemB;
      }
      else if(resJSON.Items.length > 0) {
        console.log("Got valid record back!");
        let newItemA = new ItemRecord(upc, resJSON.Items[0].name, resJSON.Items[0].highRisk);
        return newItemA;
      }
      else {
        console.log("Got empty record back!");
        let newItemC = new ItemRecord(upc, "EMPTY");
        return newItemC;
      }
    }).toPromise<ItemRecord>();
  }

  public AWSupdateItemRecord(item: ItemRecord) : Promise<ItemRecord> {
    return this.put(this.access.updateItemRecordFunction + item.upc, {"name": item.name, "highRisk": item.isHighRisk})
    .map((response) => {
      let resJSON = response.json();
      if(resJSON.upc == undefined){
        console.log("Something is REALLY wrong!\n" + resJSON);
        return new ItemRecord(item.upc, "ERROR");
      }
      else{
        let updateItem = resJSON.upc;
        //console.log("not undefined");
        return new ItemRecord(updateItem.upcId, updateItem.name, updateItem.highRisk);
      }
    }).toPromise<ItemRecord>();
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
                                                        "memo" : notification.memo
                                                      }
    )
    .map(
      (response) => {
        let resJSON = response.json();
        if(resJSON.notification == undefined) {
          console.log("Undefined response from server: " + JSON.stringify(resJSON));
          return "UNDEFINED";
        }
        else {
          console.log("Response from server: " + JSON.stringify(resJSON));
          return "SUCCESS";
        }
      }
    ).toPromise<string>();
  }

  public AWSFetchTodaysNotifications() : Promise<Notification[]> {
    let today = new Date();
    return this.get(this.access.notificationFunction + this.access.notificationRetrieval + today.toString())
    .map((response) => {
      let resJSON = response.json();
      if(resJSON.Items == undefined){
        console.log("Got back an undefined response! Here it is: " + JSON.stringify(resJSON));
        return[]
      }
      else if(resJSON.Items.length <= 0){
        console.log("No notifications for given day! Here's the response: " + JSON.stringify(resJSON));
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
    }).toPromise<Notification[]>();
  }

  public AWSPermanentDeleteNotification(Id: string) : Promise<string>{
    let body = {};
    return this.delete(this.access.notificationFunction + this.access.notificationId + Id, body)
    .map(
      (response) => {
        let resJSON = response.json();
        if (resJSON.status == 200) {
          return "SUCCESS";
        }
        else {
          return "ERROR";
        }
      }
    ).toPromise<string>();
  }

  public AWSCreateThrowaway(throwaway: Throwaway) : Promise<string> {
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
    .map(
      (response) => {
        let resJSON = response.json();
        console.log("Response from server: " + JSON.stringify(resJSON));
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
    .map((response) => {
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


  public shoutBack() {
    console.log("This is the browser service.");
  }

}
