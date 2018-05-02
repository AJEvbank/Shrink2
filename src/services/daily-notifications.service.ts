import { Injectable } from '@angular/core';

// import { ItemRecord } from '../assets/models/item-record.model';
// import { ItemCollection } from '../assets/models/item-collection.model';
import { Notification } from '../assets/models/notification.model';

import { AWSCommService } from './AWSComm.service';
import { AWSCommBrowserService } from './AWSCommBrowser.service';

import moment from 'moment';


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
    return this.AWSComm.AWScreateNotification(item)
    .then(
      (data) => {
        return data;
      }
    )
    .catch(
      (err) => {
        return "ERROR";
      }
    );
  }

  public removeItem(index: number) : void {
    //const itemSave: Notification = this.dailyNotificationsList.slice(index, index+1)[0];
    this.dailyNotificationsList.splice(index, 1);
    return;
  }

  //Fetch the list from the server, make update service list.

  public FetchList() : Promise<string> {
    //let AWSComm = (window.location.hostname == "localhost") ? this.AWSB : this.AWS;
    return this.AWSComm.AWSFetchTodaysNotifications()
    .then(
      (data: {notifications: Notification[], message: string}) => {
      this.listLoaded = true;
      let rtrn: string = "";
      if (data.message == "SUCCESS") {
        this.dailyNotificationsList = data.notifications.slice();
        rtrn = "SUCCESS";
      }else if (data.message == "EMPTY") {
        this.dailyNotificationsList = [];
        rtrn = "SUCCESS";
      }
      else {
        rtrn = "ERROR";
      }
      return data.message;
    })
    .catch((err) => {
      return "ERROR";
    })
  }

  public GetList() : Notification [] {
    return this.dailyNotificationsList.slice();
  }

  public permanentDeleteNotification(Id: string) : Promise<string> {
    return this.AWSComm.AWSPermanentDeleteNotification(Id)
    .then(
      (message: string) => {
        return message;
      }
    )
    .catch(
      (err) => {
        return "ERROR";
      }
    )
  }

  public fetchDateRangeNotifications(from: string, to: string) : Promise<string> {
    let newFrom = moment((new Date(from)).valueOf()).format("YYYY-MM-DD");
    let newTo = moment((new Date(to)).valueOf()).format("YYYY-MM-DD");
    return this.AWSComm.AWSFetchDateRangeNotifications(newFrom,newTo)
    .then(
      (data: {notifications: Notification[], message: string}) => {
        let rtrn: string = "";
        if (data.message == "SUCCESS" || data.message == "EMPTY") {
          this.dailyNotificationsList = (data.notifications.length > 0) ? data.notifications.slice() : [];
          rtrn = "SUCCESS";
        }
        else {
          rtrn = "ERROR";
        }
        return rtrn;
      }
    )
    .catch(
      (err) => {
        return "ERROR";
      }
    )
  }

  public getListLength() : number {
    return this.dailyNotificationsList.length;
  }

}
