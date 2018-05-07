import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController, AlertController } from 'ionic-angular';


import { ShelfHelperService } from '../../services/shelf-helper.service';
import { ToGetItem } from '../../assets/models/to-get-item.model';
import { ItemRecord } from '../../assets/models/item-record.model';

import { ToGetEditPopover } from './to-get-popover';

import { ItemRecordPage } from '../item-record/item-record';

import { LogHandler } from '../../assets/helpers/LogHandler';

@Component({
  selector: 'page-shelf-helper',
  templateUrl: 'shelf-helper.html',
})
export class ShelfHelperPage implements OnInit {

  private shelfHelperList: ToGetItem [] = [];

  private logger: LogHandler = new LogHandler("ShelfHelperPage");

  constructor(private navCtrl: NavController,
              private shelfHelperService: ShelfHelperService,
              private popoverCtrl: PopoverController,
              private alertCtrl: AlertController
              ) {}

  ngOnInit() {
    this.shelfHelperService.fetchList()
    .then(
      (list: ToGetItem []) => {
        this.logger.logCont(list,"ngOnInit");
        this.shelfHelperList = list;
      }
    )
    .catch(
      (err) => {
        this.logger.logErr(err,"ngOnInit");
        this.shelfHelperList = [];
      }
    )
  }

  private deleteToGetItem(index: number) : void {
    this.shelfHelperService.removeItem(index)
    .then(
      (message: string) => {
        this.logger.logCont(message,"deleteToGetItem");
        if (message == "SUCCESS") {
          this.shelfHelperList = this.shelfHelperService.loadList();
        }
        else if (message == "FAILED" || message == "ERROR") {
          this.shelfHelperList = this.shelfHelperService.loadList();
          let error = this.alertCtrl.create({title: 'Error',message:'An error occurred. Please try again.',buttons:['Dismiss']});
          error.present();
        }
    })
    .catch((err) => {
      this.logger.logErr(err,"deleteToGetItem");
    });
    return;
  }

  private editQuantity(clickEvent, toGet: ToGetItem, index: number, oldQuantity: number) : void {
    let popover = this.popoverCtrl.create(ToGetEditPopover, {toGet: toGet}, { enableBackdropDismiss: false });
    popover.present();
    popover.onDidDismiss(
      ({toGet: ToGetItem}) => {
        this.logger.logCont(toGet,"deleteToGetItem");
        this.shelfHelperService.updateItem(toGet, index, oldQuantity)
        .then(
          (data: string) => {
            this.logger.logCont(data,"deleteToGetItem");
            if (data == "SUCCESS") {
              this.shelfHelperList = this.shelfHelperService.loadList();
            }
            else if (data == "ERROR") {
              let error = this.alertCtrl.create({title: 'Error',message:'An error occurred. Please try again.',buttons:['Dismiss']});
              error.present();
            }
          }
        )
        .catch(
          (err) => {
            this.logger.logErr(err,"deleteToGetItem");
          }
        );
      }
    );
    return;
  }

  private clearList() : void {
    this.shelfHelperService.wipeStorage()
    .then(
      (message) => {
        this.logger.logCont(message,"clearList");
        if (message == "SUCCESS") {
          this.shelfHelperService.fetchList()
          .then(
            (list: ToGetItem []) => {
              this.logger.logCont(list,"clearList");
              this.shelfHelperList = list;
            }
          )
          .catch(
            (err) => {
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
        this.logger.logErr(err,"clearList");
        let error = this.alertCtrl.create({title: 'Error',message:'An error occurred. Please try again.',buttons:['Dismiss']});
        error.present();
      }
    );
    return;
  }

  private viewItem(item: ItemRecord, i) : void {
    this.navCtrl.push(ItemRecordPage,{item: item, saved: true, fromMain: false});
    return;
  }

  private refreshList() : void {
    this.shelfHelperList = this.shelfHelperService.loadList();
    return;
  }

}
