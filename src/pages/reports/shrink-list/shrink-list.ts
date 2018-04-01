import { Component, OnInit } from '@angular/core';

import { Throwaway } from '../../../assets/models/throwaway.model';


@Component({
  selector: 'page-shrink-list',
  templateUrl: 'shrink-list.html',
})
export class ShrinkListPage implements OnInit {
  private throwawayList : Throwaway[];

  constructor() {}

  ngOnInit(){
    //this.throwAwayList.push(new Throwaway())
  }

}
