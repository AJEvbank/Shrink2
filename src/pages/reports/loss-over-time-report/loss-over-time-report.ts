import { Component, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { Throwaway } from '../../../assets/models/throwaway.model';

@Component({
  selector: 'page-loss-over-time-report',
  templateUrl: 'loss-over-time-report.html',
})
export class LossOverTimeReportPage implements OnInit {
  graphData : Throwaway[];

  testData = [65, 59, 80, 81, 56, 55, 40];
  testLabels = ['1', '2', '3', '4', '5', '6', '7'];
  chartType = 'line';
  lineChartOptions = { responsive: true };

  constructor(private navParams: NavParams) {}

  ngOnInit(){
    this.graphData = this.navParams.data;
    console.log(this.graphData);

    /*
      Need the sum of all the throwaways on each day of the date range for each upc
    */
  }
}
