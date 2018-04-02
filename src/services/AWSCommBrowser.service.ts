import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';

import { Accessor } from '../../../Accessor';

import { ItemRecord } from '../assets/models/item-record.model';
import { Notification } from '../assets/models/notification.model';
import { Throwaway } from '../assets/models/throwaway.model';


//import { uuid } from 'uuid/v1';

@Injectable()
export class AWSCommBrowserService {

  access = new Accessor();

  constructor(private http: Http) {

  }

  // Generic http request functions return Promise<HTTPResponse>.

  private put(functionURL: string, body: any) : Observable<Response> {
    // let header = new Headers();
    // header.append('Content-Type', 'application/json');
    // header.append('Authorization', 'Basic');
    // let options = new RequestOptions( {headers: header} );
    // return this.http.put(this.access.base + functionURL, body, options);
    return this.http.put(this.access.base + functionURL, body);
  }

  private get(functionURL: string) : Observable<Response> {
    return this.http.get(this.access.base + functionURL);
  }


  // Specific requests return a Promise<(desired data type here)>.

  public AWSgetupc(upc: string) : Promise<ItemRecord> {
    return this.get(this.access.upcFunction + upc).map((response) => {
      let resJSON = response.json();
      console.log(resJSON);
      if(resJSON.Items.length > 0){
        //console.log("Got valid record back!");
        return new ItemRecord(upc, resJSON.Items[0].name, resJSON.Items[0].highRisk);
      }else{
        //console.log("Got empty record back!");
        return new ItemRecord(upc, " ");
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
        console.log("not undefined");
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


  public AWSFetchTodaysNotifications() : Promise<string> {
    return this.get(this.access.notificationFunction + this.access.notificationRetrieval)
    .map(
      (response) => {
        let resJSON = response.json();
        console.log("Response from server: " + JSON.stringify(resJSON));
        if (resJSON == undefined) { // What property is undefined?
          return "ERROR";
        }
        else {
          return "SUCCESS";
        }
      }
    ).toPromise<string>();
  }

  // This is for creating a throwaway entry.
  public AWSCreateThrowaway(throwaway: Throwaway) : Promise<string> {
    console.log("Creating throwaway: " + JSON.stringify(throwaway));
    return this.put(this.access.throwawayFunction, {"throwaway": JSON.stringify(throwaway)})
    .map(
      (response) => {
        let resJSON = response.json();
        console.log("Response from server: " + JSON.stringify(resJSON));
        if (resJSON == undefined) { // What property is undefined?
          return "ERROR";
        }
        else {
          return "SUCCESS";
        }
      }
    ).toPromise<string>();
  }

}
