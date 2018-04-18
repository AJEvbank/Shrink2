import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { SQLite } from '@ionic-native/sqlite';
import { IonicStorageModule } from '@ionic/storage';
import { DatePicker } from '@ionic-native/date-picker';
import { HTTP } from '@ionic-native/http';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';

import { LoginPage } from '../pages/login/login';
import { MainPage } from '../pages/main/main';
import { HighRiskListPage } from '../pages/high-risk-list/high-risk-list';
import { ShelfHelperPage } from '../pages/shelf-helper/shelf-helper';

import { DailyNotificationsPage } from '../pages/daily-notifications/daily-notifications';
import { NotificationPopoverPage } from '../pages/daily-notifications/notification-popover';
import { GetUPCPopover } from '../pages/main/getUPCpopover';
import { ToGetEditPopover } from '../pages/shelf-helper/to-get-popover';
import { SearchByDateRangePopover } from '../pages/daily-notifications/searchByDateRange';

import { ItemRecordPage } from '../pages/item-record/item-record';
import { ShelfHelperAddQuantityPopover } from '../pages/item-record/shelf-helper_popover';
import { ThrowawayQuantityPricePopoverPage } from '../pages/item-record/throwaway_popover';
import { EditItemRecordPage } from '../pages/item-record/edit-item-record/edit-item-record';
import { CreateNotificationPage } from '../pages/item-record/create-notification/create-notification';
import { EditNotificationPage } from '../pages/daily-notifications/edit-notification/edit-notification';

import { ReportsPage } from '../pages/reports/reports';
import { CalendarPage } from '../pages/reports/calendar/calendar';
import { LossOverTimeReportPage } from '../pages/reports/loss-over-time-report/loss-over-time-report';
import { ReportSpecificationsPage } from '../pages/reports/report-specifications/report-specifications';
import { ShrinkListPage } from '../pages/reports/shrink-list/shrink-list';

import { ScannerService } from '../services/scanner.service';
import { DailyNotificationsService } from '../services/daily-notifications.service';
import { ShelfHelperService } from '../services/shelf-helper.service';
import { AWSCommService } from '../services/AWSComm.service';
import { AWSCommBrowserService } from '../services/AWSCommBrowser.service';
import { HighRiskListService } from '../services/high-risk-list.service';

import { Accessor } from '../../../Accessor';

import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    MainPage,
    DailyNotificationsPage,
    HighRiskListPage,
    ShelfHelperPage,
    ItemRecordPage,
    ReportsPage,
    EditItemRecordPage,
    CreateNotificationPage,
    CalendarPage,
    LossOverTimeReportPage,
    ReportSpecificationsPage,
    ShrinkListPage,
    NotificationPopoverPage,
    Accessor,
    GetUPCPopover,
    ShelfHelperAddQuantityPopover,
    ThrowawayQuantityPricePopoverPage,
    ToGetEditPopover,
    EditNotificationPage,
    SearchByDateRangePopover
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule,
    ChartsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    MainPage,
    DailyNotificationsPage,
    HighRiskListPage,
    ShelfHelperPage,
    ItemRecordPage,
    ReportsPage,
    EditItemRecordPage,
    CreateNotificationPage,
    CalendarPage,
    LossOverTimeReportPage,
    ReportSpecificationsPage,
    ShrinkListPage,
    NotificationPopoverPage,
    GetUPCPopover,
    ShelfHelperAddQuantityPopover,
    ThrowawayQuantityPricePopoverPage,
    ToGetEditPopover,
    EditNotificationPage,
    SearchByDateRangePopover
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BarcodeScanner,
    SQLite,
    ScannerService,
    DatePicker,
    DailyNotificationsService,
    ShelfHelperService,
    AWSCommService,
    AWSCommBrowserService,
    HighRiskListService,
    HTTP
  ]
})
export class AppModule {}
