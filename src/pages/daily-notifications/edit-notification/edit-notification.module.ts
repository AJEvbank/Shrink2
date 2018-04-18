import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditNotificationPage } from './edit-notification';

@NgModule({
  declarations: [
    EditNotificationPage,
  ],
  imports: [
    IonicPageModule.forChild(EditNotificationPage),
  ],
})
export class EditNotificationPageModule {}
