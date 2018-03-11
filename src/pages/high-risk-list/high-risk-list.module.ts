import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HighRiskListPage } from './high-risk-list';

@NgModule({
  declarations: [
    HighRiskListPage,
  ],
  imports: [
    IonicPageModule.forChild(HighRiskListPage),
  ],
})
export class HighRiskListPageModule {}
