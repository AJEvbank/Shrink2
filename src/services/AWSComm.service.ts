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


  // Specific requests return a Promise<(desired data type here)>.

  public AWSgetupc(upc: string) : Promise<ItemRecord> {
    return this.get(this.access.upcFunction + upc)
    .then((response) => {
      let resJSON = JSON.parse(response.data);
      console.log("resJSON: " + JSON.stringify(resJSON));
      // if (resJSON.upcnumber != undefined) {
      //   console.log("Got valid record back from upcdatabase.org! ");
      //   return new ItemRecord(upc, resJSON.title, false);
      // }
      // else
      if(resJSON.Items.length > 0){
        console.log("Got valid record back!");
        return new ItemRecord(upc, resJSON.Items[0].name, resJSON.Items[0].highRisk);
      }else{
        console.log("Got empty record back!");
        return new ItemRecord(upc, "(Add New Item Name Here)");
      }
    })
    .catch((err) => {
      console.log("Caught error from get: " + JSON.stringify(err));
      return new ItemRecord(upc, " ");
    });
  }

  public AWSupdateItemRecord(item: ItemRecord) : Promise<ItemRecord> {
    return this.put(this.access.updateItemRecordFunction + item.upc, {"name": item.name, "highRisk": item.isHighRisk})
    .then(
      (response) => {
        let resJSON = JSON.parse(response.data);
        console.log("Got the updated record back! " + JSON.stringify(response));
        console.log("resJSON.upc.upcId = " + JSON.stringify(resJSON.upc.upcId));
        if (resJSON.upc.upcId == undefined) {
          console.log("Backend shenanigans happened!");
          return new ItemRecord(item.upc, "EMPTY");
        }
        let updateItem = resJSON;
        if (item.upc != updateItem.upc.upcId) {
          console.log(item.upc + " != " + updateItem.upc.upcId + ": Something went horribly wrong!");
          return new ItemRecord(item.upc, "WRONG_UPC");
        } else {
          return new ItemRecord(updateItem.upc.upcId, updateItem.upc.name, updateItem.upc.highRisk);
        }
      }
    )
    .catch(
      (err) => {
        console.log("Error on http request: " + JSON.stringify(err));
        return new ItemRecord(item.upc, " ");
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
                                                        "memo" : notification.memo
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

  //Untested
  public AWSFetchTodaysNotifications() : Promise<Notification[]> {
    console.log("Entered AWSFetchTodaysNotifications() via device service");
    let today = new Date();
    return this.get(this.access.notificationFunction + this.access.notificationRetrieval + today.toString())
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
        for(let res of resJSON.Items){
          let itemCollection = new ItemCollection(new ItemRecord(res.item.upc, res.item.name, res.item.isHighRisk), res.quantity, res.unitPrice);
          todaysNotifs.push(new Notification(itemCollection, res.sellByDate, res.daysPrior, res.deliveryOption, res.memo));
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
    return this.put(this.access.throwawayFunction, {"throwaway": JSON.stringify(throwaway)})
    .then(
      (response) => {
        let resJSON = response.data.json();
        console.log("Response from server: " + JSON.stringify(resJSON) + " :=> " + resJSON);
        if (resJSON == undefined) {
          return "ERROR";
        }
        else {
          return "SUCCESS";
        }
      }
    )
    .catch(
      (err) => {
        console.log("Caught error from put: " + err.json());
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

  public shoutBack() {
    console.log("This is the device service.");
  }

}
