import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

import { Notification } from '../assets/models/notification.model';

import { AWSCommService } from './AWSComm.service';
import { AWSCommBrowserService } from './AWSCommBrowser.service';


@Injectable()
export class DailyNotificationsService {

  dailyNotificationsList: Notification [] = [];

  constructor(private storage: Storage,
              private AWS: AWSCommService,
              private AWSB: AWSCommBrowserService){}

  public addItem(item: Notification){
    console.log("In then: " + JSON.stringify(item));
    this.AWSB.AWScreateNotification(item);
    // this.dailyNotificationsList.push(item);
    // this.storage.set('dailyNotificationsList', this.dailyNotificationsList)
    // .then(
    //   (val) => {
    //     console.log("Val: " + JSON.stringify(val));
    //     console.log("In then: " + JSON.stringify(item));
    //     this.AWSB.AWScreateNotification(val[0]);
    //     return;
    //   }
    //   // (rtrn) => {
    //   //   this.AWS.AWScreateNotification(item);
    //   // }
    // )
    // .catch(
    //   (err) => {
    //     console.log("Caught in addItem: " + err.toString());
    //     this.dailyNotificationsList.splice(this.dailyNotificationsList.indexOf(item, 1), 1);
    //     return;
    //   }
    // );
  }

  removeItem(index: number){
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

  fetchList() {
    // Server logic should be in this method.
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

  fetchListTemp() {
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

  loadList() {
    return this.dailyNotificationsList.slice();
  }
}
