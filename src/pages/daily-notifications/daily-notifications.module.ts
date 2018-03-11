import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DailyNotificationsPage } from './daily-notifications';

@NgModule({
  declarations: [
    DailyNotificationsPage,
  ],
  imports: [
    IonicPageModule.forChild(DailyNotificationsPage),
  ],
})
export class DailyNotificationsPageModule {}
