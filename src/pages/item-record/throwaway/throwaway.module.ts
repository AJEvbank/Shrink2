import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ThrowawayPage } from './throwaway';

@NgModule({
  declarations: [
    ThrowawayPage,
  ],
  imports: [
    IonicPageModule.forChild(ThrowawayPage),
  ],
})
export class ThrowawayPageModule {}
