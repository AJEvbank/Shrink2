import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShrinkListPage } from './shrink-list';

@NgModule({
  declarations: [
    ShrinkListPage,
  ],
  imports: [
    IonicPageModule.forChild(ShrinkListPage),
  ],
})
export class ShrinkListPageModule {}
