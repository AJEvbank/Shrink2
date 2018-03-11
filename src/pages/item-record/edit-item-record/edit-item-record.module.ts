import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditItemRecordPage } from './edit-item-record';

@NgModule({
  declarations: [
    EditItemRecordPage,
  ],
  imports: [
    IonicPageModule.forChild(EditItemRecordPage),
  ],
})
export class EditItemRecordPageModule {}
