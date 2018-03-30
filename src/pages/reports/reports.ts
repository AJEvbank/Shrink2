import { Component } from '@angular/core';

import { ReportSpecificationsPage } from './report-specifications/report-specifications';
import { ShrinkListPage } from './shrink-list/shrink-list';

@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html',
})
export class ReportsPage {
  reportSpecificationsPage = ReportSpecificationsPage;
  shrinkListPage = ShrinkListPage;
  //Report Types for data passing...
  RT_shrinkList = 'Shrink List';
  RT_lossOverTime = 'Loss Over Time';
  RT_calendarView = 'Calendar View';
  RT_excelSpreadsheet = 'Excel Spreadsheet';                      
}
