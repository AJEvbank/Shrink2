import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
  selector: 'page-report-specifications',
  templateUrl: 'report-specifications.html',
})
export class ReportSpecificationsPage {
  reportType: string;
  templateTitle = "Default Report Specifications";

  constructor(private navParams: NavParams) {
    //console.log(this.navParams.data);
    //console.log(this.reportType == ReportType.shrinkList);
    this.reportType = this.navParams.data;
    this.templateTitle = this.reportType + " Specifications";
  }
}
