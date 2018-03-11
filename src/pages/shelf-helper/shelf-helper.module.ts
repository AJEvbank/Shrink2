import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShelfHelperPage } from './shelf-helper';

@NgModule({
  declarations: [
    ShelfHelperPage,
  ],
  imports: [
    IonicPageModule.forChild(ShelfHelperPage),
  ],
})
export class ShelfHelperPageModule {}
