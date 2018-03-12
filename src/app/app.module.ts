import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { File } from '@ionic-native/file';
import { SQLite } from '@ionic-native/sqlite';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

import { LoginPage } from '../pages/login/login';
import { MainPage } from '../pages/main/main';
import { DailyNotificationsPage } from '../pages/daily-notifications/daily-notifications';
import { HighRiskListPage } from '../pages/high-risk-list/high-risk-list';
import { ShelfHelperPage } from '../pages/shelf-helper/shelf-helper';

import { ItemRecordPage } from '../pages/item-record/item-record';
import { EditItemRecordPage } from '../pages/item-record/edit-item-record/edit-item-record';
import { CreateNotificationPage } from '../pages/item-record/create-notification/create-notification';
import { ThrowawayPage } from '../pages/item-record/throwaway/throwaway';

import { ReportsPage } from '../pages/reports/reports';
import { CalendarPage } from '../pages/reports/calendar/calendar';
import { LossOverTimeReportPage } from '../pages/reports/loss-over-time-report/loss-over-time-report';
import { ReportSpecificationsPage } from '../pages/reports/report-specifications/report-specifications';
import { ShrinkListPage } from '../pages/reports/shrink-list/shrink-list';

import { ScannerService } from '../services/scanner.service';

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
    ThrowawayPage,
    CalendarPage,
    LossOverTimeReportPage,
    ReportSpecificationsPage,
    ShrinkListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
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
    ThrowawayPage,
    CalendarPage,
    LossOverTimeReportPage,
    ReportSpecificationsPage,
    ShrinkListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BarcodeScanner,
    File,
    SQLite,
    ScannerService
  ]
})
export class AppModule {}
