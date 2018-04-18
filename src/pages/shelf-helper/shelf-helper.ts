import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController, AlertController } from 'ionic-angular';


import { ShelfHelperService } from '../../services/shelf-helper.service';
import { ToGetItem } from '../../assets/models/to-get-item.model';
import { ItemRecord } from '../../assets/models/item-record.model';

import { ToGetEditPopover } from './to-get-popover';

import { ItemRecordPage } from '../item-record/item-record';

@Component({
  selector: 'page-shelf-helper',
  templateUrl: 'shelf-helper.html',
})
export class ShelfHelperPage implements OnInit {

  shelfHelperList: ToGetItem [] = [];

  constructor(private navCtrl: NavController,
              private shelfHelperService: ShelfHelperService,
              private popoverCtrl: PopoverController,
              private alertCtrl: AlertController) {}

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
    this.shelfHelperService.removeItem(index)
    .then(() => {
      this.shelfHelperList = this.shelfHelperService.loadList();
      console.log(this.shelfHelperList);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  editQuantity(clickEvent, toGet: ToGetItem) {
    let popover = this.popoverCtrl.create(ToGetEditPopover, {toGet: toGet});
    popover.present();
    popover.onDidDismiss(
      ({toGet: ToGetItem}) => {

        this.shelfHelperService.updateItem(toGet);
        this.shelfHelperList = this.shelfHelperService.loadList();
      }
    );
  }

  clearList() {
    this.shelfHelperService.wipeStorage()
    .then(
      (message) => {
        if (message == "SUCCESS") {
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
          );
        }
        else if (message == "ERROR") {
          let error = this.alertCtrl.create({title: 'Error',message:'An error occurred. Please try again.',buttons:['Dismiss']});
          error.present();
        }
      }
    )
    .catch(
      (err) => {
        console.log("Error when clearing storage: " + JSON.stringify(err) + " :=> " + err.json());
        let error = this.alertCtrl.create({title: 'Error',message:'An error occurred. Please try again.',buttons:['Dismiss']});
        error.present();
      }
    );
  }

  viewItem(item: ItemRecord, i) {
    console.log("viewItem(" + JSON.stringify(item) + ", " + i + ")");
    this.navCtrl.push(ItemRecordPage,{item: item, saved: true, fromMain: false});
  }

  refreshList() {
    this.shelfHelperList = this.shelfHelperService.loadList();
  }

}
