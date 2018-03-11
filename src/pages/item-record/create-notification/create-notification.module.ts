import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateNotificationPage } from './create-notification';

@NgModule({
  declarations: [
    CreateNotificationPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateNotificationPage),
  ],
})
export class CreateNotificationPageModule {}
