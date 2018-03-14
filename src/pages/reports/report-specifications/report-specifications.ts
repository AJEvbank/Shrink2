import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
  selector: 'page-report-specifications',
  templateUrl: 'report-specifications.html',
})
export class ReportSpecificationsPage {
  reportType: string;
  templateTitle = "Default Report Specifications";

  //Calendar Specific Data
  dateTime: any;

  constructor(private navParams: NavParams) {
    this.reportType = this.navParams.data;
    this.templateTitle = this.reportType + " Specifications";
  }
}
