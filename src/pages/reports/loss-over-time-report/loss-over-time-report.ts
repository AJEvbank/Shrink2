import { Component, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { Throwaway } from '../../../assets/models/throwaway.model';

@Component({
  selector: 'page-loss-over-time-report',
  templateUrl: 'loss-over-time-report.html',
})
export class LossOverTimeReportPage implements OnInit {

  testData = [65, 59, 80, 81, 56, 55, 40];
  testLabels = ['1', '2', '3', '4', '5', '6', '7'];
  chartType = 'line';
  lineChartOptions = { responsive: true };

  constructor(private navParams: NavParams) {}

  ngOnInit(){
    let specs = this.navParams.data;
    let dayShrinkValues = specs.dayShrinkValues;
    let dateRangeStart = new Date(specs.dateRangeStart);
    this.testData = [];
    this.testLabels = [];

    for(let i = 0; i < dayShrinkValues.length; i++){
      let date = new Date(dateRangeStart.getFullYear(), dateRangeStart.getMonth(), dateRangeStart.getDate()+i);
      this.testLabels.push((date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear());
      this.testData.push(dayShrinkValues[i]);
    }
  }
}
