import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LossOverTimeReportPage } from './loss-over-time-report';

@NgModule({
  declarations: [
    LossOverTimeReportPage,
  ],
  imports: [
    IonicPageModule.forChild(LossOverTimeReportPage),
  ],
})
export class LossOverTimeReportPageModule {}
