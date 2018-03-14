import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

import { Notification } from '../assets/models/notification.model';

@Injectable()
export class DailyNotificationsService {

  dailyNotificationsList: Notification [] = [];

  constructor(private storage: Storage){}

  addItem(item: Notification){
    this.dailyNotificationsList.push(item);
    this.storage.set('dailyNotificationsList', this.dailyNotificationsList)
    .then(
      // Push to server...
      // Storage won't be needed in this case. It should be a server communication
      // function.
    )
    .catch(
      (err) => {
        console.log(err);
        this.dailyNotificationsList.splice(this.dailyNotificationsList.indexOf(item, 1), 1);
      }
    );
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
