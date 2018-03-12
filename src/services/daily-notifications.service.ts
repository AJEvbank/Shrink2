import { Storage } from '@ionic/storage';

import { Notification } from '../assets/models/notification.model';

export class DailyNotificationsService {

  dailyNotificationsList: Notification [];
  dailyNotificationsItem: Notification;
  index: number;

  constructor(private storage: Storage){}

  addItem(item: Notification){
    this.dailyNotificationsList.push(item);
    this.storage.set('dailyNotificationsList', this.dailyNotificationsList)
    .then(
      // Push to server...
    )
    .catch(
      (err) => {
        console.log(err);
        this.dailyNotificationsList.splice(this.dailyNotificationsList.indexOf(item, 1), 1);
      }
    );
  }

  removeItem(index: number){
    const itemSave: Notification = this.dailyNotificationsList.splice(index, index+1)[0];
    this.dailyNotificationsList.splice(index, 1);
    this.storage.set('dailyNotificationsList', this.dailyNotificationsList)
    .then(
      //Server talk here...
    )
    .catch(
      (err) => {
        console.log(err);
        this.dailyNotificationsList.push(itemSave);
      }
    );
  }

  fetchList() {
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
}
