import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

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
    this.storage.set('dailyNotificationsList', this.dailyNotificationsList)
    .then(
      //Server logic here...
    )
    .catch(
      (err) => {
        console.log(err);
        this.dailyNotificationsList.push(itemSave);
      }
    );
  }

  public fetchListLocal() {
    // Use this for local host.
    this.AWSB.AWSFetchTodaysNotifications()
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
        // Set the list to [].
      }
    );
    return;
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

  public fetchListTemp() {
    return this.storage.get('dailyNotificationsList')
    .then(
      (list: Notification []) => {
        this.dailyNotificationsList = list != null ? list: [];
        return this.dailyNotificationsList;
      }
    )
    .catch(
      (err) => {
        console.log(err);
      }
    );
  }

  public loadList() {
    return this.dailyNotificationsList.slice();
  }
}
