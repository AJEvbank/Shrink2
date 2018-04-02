import { Component, OnInit } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';

import { Throwaway } from '../../../assets/models/throwaway.model';
import { ShrinkAggregate } from '../../../assets/models/shrink-agreggate.model';


@Component({
  selector: 'page-shrink-list',
  templateUrl: 'shrink-list.html',
})
export class ShrinkListPage implements OnInit {
  private throwawayList : Throwaway[];
  private shrinkList: ShrinkAggregate[];

  constructor(private navParams: NavParams) {}

  ngOnInit(){
    this.shrinkList = this.navParams.data as ShrinkAggregate[];
    this.shrinkList.sort((a, b) => {
      if(a.shrink > b.shrink){
        return -1;
      }
      else if(a.shrink < b.shrink){
        return 1;
      }
      else{
        return 0;
      }
    })
  }

  onToggleHighRisk(index: number){
    console.log("Clicked on " + this.shrinkList[index].upc);
  }

}
