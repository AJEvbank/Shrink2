import { Injectable } from '@angular/core';

import { ItemRecord } from '../assets/models/item-record.model';
import { ItemCollection } from '../assets/models/item-collection.model';
import { Notification } from '../assets/models/notification.model';

import { AWSCommService } from './AWSComm.service';
import { AWSCommBrowserService } from './AWSCommBrowser.service';


@Injectable()
export class DailyNotificationsService {

  private dailyNotificationsList: Notification [] = [];

  private listLoaded = false;

  constructor(private AWS: AWSCommService,
              private AWSB: AWSCommBrowserService) {}

  public isListLoaded() : boolean {
    return this.listLoaded;
  }


  public addItem(item: Notification) : Promise<string> {
    console.log("Firing addItem(): " + JSON.stringify(item));
    let AWSComm = (window.location.hostname == "localhost") ? this.AWSB : this.AWS;
    return AWSComm.AWScreateNotification(item)
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
    const itemSave: Notification = this.dailyNotificationsList.slice(index, index+1)[0];
    this.dailyNotificationsList.splice(index, 1);
  }

  //Fetch the list from the server, make update service list.
  //Promise is void to act more as an ack
  public FetchList() : Promise<void> {
    let AWSComm = (window.location.hostname == "localhost") ? this.AWSB : this.AWS;
    return AWSComm.AWSFetchTodaysNotifications()
    .then((todaysNotifs) => {
      this.listLoaded = true;
      this.dailyNotificationsList = todaysNotifs;
    })
    .catch((err) => {
      console.log(err);
      this.listLoaded = true;
    })
  }

  public GetList() {
    return this.dailyNotificationsList.slice();
  }
}
