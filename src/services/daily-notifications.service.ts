import { Injectable } from '@angular/core';

// import { ItemRecord } from '../assets/models/item-record.model';
// import { ItemCollection } from '../assets/models/item-collection.model';
import { Notification } from '../assets/models/notification.model';

import { AWSCommService } from './AWSComm.service';
import { AWSCommBrowserService } from './AWSCommBrowser.service';


@Injectable()
export class DailyNotificationsService {

  private dailyNotificationsList: Notification [] = [];

  private listLoaded = false;
  private AWSComm: AWSCommService | AWSCommBrowserService;

  constructor(private AWS: AWSCommService,
              private AWSB: AWSCommBrowserService) {
    this.AWSComm = (window.location.hostname == "localhost") ? this.AWSB : this.AWS;
    this.AWSComm.shoutBack();
  }

  public isListLoaded() : boolean {
    return this.listLoaded;
  }


  public addItem(item: Notification) : Promise<string> {
    console.log("Firing addItem(): " + JSON.stringify(item));
    //let AWSComm = (window.location.hostname == "localhost") ? this.AWSB : this.AWS;
    return this.AWSComm.AWScreateNotification(item)
    .then(
      (data) => {
        if (data == "SUCCESS") {
          return data;
        }
        else if (data == "UNDEFINED" || data == "ERROR"){
          return "ERROR";
        }
      }
    )
    .catch(
      (err) => {
        console.log("Error caught in addItem(): " + err.toString() + " Stringified error: " + JSON.stringify(err));
        return "ERROR";
      }
    );
  }

  public removeItem(index: number){
    //const itemSave: Notification = this.dailyNotificationsList.slice(index, index+1)[0];
    this.dailyNotificationsList.splice(index, 1);
  }

  //Fetch the list from the server, make update service list.
  //Promise is void to act more as an ack

  public FetchList() : Promise<void> {
    //let AWSComm = (window.location.hostname == "localhost") ? this.AWSB : this.AWS;
    return this.AWSComm.AWSFetchTodaysNotifications()
    .then((todaysNotifs) => {
      this.listLoaded = true;
      this.dailyNotificationsList = todaysNotifs.slice();
    })
    .catch((err) => {
      console.log(err);
      this.listLoaded = true;
    })
  }

  public GetList() {
    console.log("In GetList():" + JSON.stringify(this.dailyNotificationsList));
    return this.dailyNotificationsList.slice();
  }

  public permanentDeleteNotification(Id: string) : Promise<string> {
    console.log("In service function.");
    return this.AWSComm.AWSPermanentDeleteNotification(Id)
    .then(
      (message: string) => {
        console.log("message in service: " + message);
        return message;
      }
    )
    .catch(
      (err) => {
        console.log("Error caught in permanentDeleteNotification(): " + err.json() + " :=> " + JSON.stringify(err));
        return "ERRORING";
      }
    )
  }

  public fetchDateRangeNotifications(from: string, to: string) : Promise<string> {
    return this.AWSComm.AWSFetchDateRangeNotifications(from,to)
    .then(
      (notifications: Notification []) => {
        this.dailyNotificationsList = (notifications.length > 0) ? notifications.slice() : [];
        return "SUCCESS";
      }
    )
    .catch(
      (err) => {
        console.log("Caught error in fetchDateRangeNotifications(): " + err.json() + " :=> " + JSON.stringify(err));
        return "ERROR";
      }
    )
  }

  getListLength() : number {
    return this.dailyNotificationsList.length;
  }

}
