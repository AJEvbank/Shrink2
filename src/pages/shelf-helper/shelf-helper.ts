import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';


import { ShelfHelperService } from '../../services/shelf-helper.service';
import { ToGetItem } from '../../assets/models/to-get-item.model';

import { ToGetEditPopover } from './to-get-popover';

@Component({
  selector: 'page-shelf-helper',
  templateUrl: 'shelf-helper.html',
})
export class ShelfHelperPage implements OnInit {

  shelfHelperList: ToGetItem [] = [];

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private shelfHelperService: ShelfHelperService,
              private popoverCtrl: PopoverController) {
  }

  ngOnInit() {
    this.shelfHelperService.fetchList()
    .then(
      (list: ToGetItem []) => {
        this.shelfHelperList = list;
      }
    )
    .catch(
      (err) => {
        console.log(err);
        this.shelfHelperList = [];
      }
    )
  }

  deleteToGetItem(index: number) {
    this.shelfHelperService.removeItem(index);
    this.shelfHelperList = this.shelfHelperService.loadList();
    console.log(this.shelfHelperList);
  }

  editQuantity(clickEvent, toGet: ToGetItem) {
    let popover = this.popoverCtrl.create(ToGetEditPopover, {toGet: toGet});
    popover.present();
    popover.onDidDismiss(
      () => {
        this.shelfHelperList = this.shelfHelperService.loadList();
      }
    );
  }

}
