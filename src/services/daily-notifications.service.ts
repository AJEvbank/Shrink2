import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

import { ItemRecord } from '../assets/models/item-record.model';
import { ItemCollection } from '../assets/models/item-collection.model';
import { Notification } from '../assets/models/notification.model';

import { AWSCommService } from './AWSComm.service';
import { AWSCommBrowserService } from './AWSCommBrowser.service';


@Injectable()
export class DailyNotificationsService {

  private dailyNotificationsList: Notification [] = [];

  private listLoaded : boolean;

  constructor(private storage: Storage,
              private AWS: AWSCommService,
              private AWSB: AWSCommBrowserService) {

      this.listLoaded = false;
  }

  public isListLoaded() : boolean {
    return this.listLoaded;
  }


  public addItem(item: Notification) : Promise<string> {
    console.log("Firing addItem(): " + JSON.stringify(item));
    if (window.location.hostname == "localhost") {
      return this.AWSB.AWScreateNotification(item)
      .then(
        (data) => {
          if (data == "SUCCESS") {
            return data;
          }
          else if (data == "UNDEFINED"){
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
    else {
      return this.AWS.AWScreateNotification(item)
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
  }

  public removeItem(index: number){
    const itemSave: Notification = this.dailyNotificationsList.slice(index, index+1)[0];
    this.dailyNotificationsList.splice(index, 1);
  }

  public fetchListLocal() : Promise<{statusCode: string}> {
    return this.AWSB.AWSFetchTodaysNotifications()
    .then(
      (message) => {
        let serverResp = message.json();

        if (serverResp.Items == undefined) {
          return {statusCode: "UNDEFINED"};
        }
        else if (serverResp.Items.length == 0) {
          this.dailyNotificationsList = [];
          this.listLoaded = true;
          return {statusCode: "EMPTY"};
        }
        else {
          this.dailyNotificationsList = [];
          serverResp.Items.map(
            (item) => {
              this.dailyNotificationsList.push(
                new Notification(
                  new ItemCollection(new ItemRecord(item.item.upc,item.item.name,item.item.isHighRisk),item.quantity,item.unitPrice),
                  item.sellByDate,
                  item.daysPrior,
                  item.deliveryOption,
                  item.memo
                )
              );
            }
          );
          console.log("dailyNotificationsList: " + JSON.stringify(this.dailyNotificationsList));
          this.listLoaded = true;
          return {statusCode: "SUCCESS"};
        }
      }
    )
    .catch(
      (err) => {
        // Do not change the existing list.
        console.log("Error from AWSB in fetchListLocal()." + err.json() + " :=> " + JSON.stringify(err));
        return {statusCode: "ERROR"};
      }
    );
  }

  public fetchListDevice() {
    // Use this for the device.

    this.AWS.AWSFetchTodaysNotifications()
    .then(
      (message) => {
        if (message == "SUCCESS") {
          // Store the fetched list.
          // Set listLoaded to true.
        }
        else if (message == "ERROR") {
          // Set the list to [].
        }
      }
    )
    .catch(
      (err) => {

      }
    );
    return;
  }

  public loadList() {
    return this.dailyNotificationsList.slice();
  }
}
