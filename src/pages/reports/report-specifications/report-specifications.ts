import { Component, OnInit } from '@angular/core';
import { NavParams, NavController, AlertController, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

import { ScannerService } from '../../../services/scanner.service';
import { AWSCommService } from '../../../services/AWSComm.service';
import { AWSCommBrowserService } from '../../../services/AWSCommBrowser.service';

import { LossOverTimeReportPage } from '../loss-over-time-report/loss-over-time-report';
import { CalendarPage } from '../calendar/calendar';

//Temp Imports
import { Throwaway } from '../../../assets/models/throwaway.model';
import { ItemCollection } from '../../../assets/models/item-collection.model';
import { ItemRecord } from '../../../assets/models/item-record.model';
import { ShrinkAggregate } from '../../../assets/models/shrink-agreggate.model';

import { LogHandler } from '../../../assets/helpers/LogHandler';

@Component({
  selector: 'page-report-specifications',
  templateUrl: 'report-specifications.html',
})
export class ReportSpecificationsPage implements OnInit {

  LOTPage = LossOverTimeReportPage;
  calendarPage = CalendarPage;

  reportType = "";
  templateTitle = "Default Report Specifications";
  errorMessage = "";

  //Calendar specific
  shrinkThreshold = "";

  //Shared by all
  reportForm : FormGroup;
  subjectSelection = "";
  subjectUPC = "";
  dateRangeStart = new Date();
  dateRangeEnd = new Date();
  isLocalHost = false;
  AWSComm : AWSCommService | AWSCommBrowserService;


  private logger: LogHandler = new LogHandler("ReportSpecificationsPage");


  constructor(private navParams: NavParams,
              private navCtrl: NavController,
              private scanner: ScannerService,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private AWSBrowser: AWSCommBrowserService,
              private AWSMobile: AWSCommService) {}

  ngOnInit() {
    this.reportType = this.navParams.data;
    this.templateTitle = this.reportType + " Specifications";
    this.isLocalHost = (window.location.hostname == "localhost") ? true : false;
    this.AWSComm = (this.isLocalHost) ? this.AWSBrowser : this.AWSMobile;
    this.initializeForm();
  }

  private initializeForm(){
    if(this.reportType == "Loss Over Time"){
      this.reportForm = new FormGroup({
        //For now, just doing line graphs. May add bar graph in the future.
        "subjectSelection": new FormControl(this.subjectSelection, Validators.required),
        "dateRangeStart": new FormControl(this.dateRangeStart.toISOString(), Validators.required),
        "dateRangeEnd": new FormControl(this.dateRangeEnd.toISOString(), Validators.required)
      });
    }
    else if(this.reportType == 'Calendar View'){
      this.reportForm = new FormGroup({
        //For now, just doing line graphs. May add bar graph in the future.
        "subjectSelection": new FormControl(this.subjectSelection, Validators.required),
        "dateRangeStart": new FormControl(this.dateRangeStart.toISOString(), Validators.required),
        "dateRangeEnd": new FormControl(this.dateRangeEnd.toISOString(), Validators.required),
        "shrinkThreshold": new FormControl(this.shrinkThreshold, Validators.pattern(/^\d{0,9}(?:\.(?:\d{1,2}))?$/))
        //"shrinkThreshold": new FormControl(this.shrinkThreshold, Validators.pattern(/^\.\d{1,2}$/))
      });
    }
  }

  private onSubmit(){
    let value = this.reportForm.value;
    this.subjectSelection = value.subjectSelection;
    if(this.subjectSelection == "SingleItem"){
      this.subjectUPC = value.subjectUPC;
    }
    this.dateRangeStart = new Date(value.dateRangeStart);
    this.dateRangeEnd = new Date(value.dateRangeEnd);
    if(this.reportType == "Calendar View"){
      this.shrinkThreshold = value.shrinkThreshold;
    }


    this.errorMessage = "";
    if(this.dateRangeEnd < this.dateRangeStart){
      this.errorMessage = "End date must be equal to or later than the start date.";
      return false; //Not actually necessary.
    }

    //Server stuff.
    let loader = this.loadingCtrl.create({
      content: "Building report..."
    });
    loader.present();

    this.AWSComm.AWSGetLossOverTime(this.dateRangeStart, this.dateRangeEnd, this.subjectSelection, this.subjectUPC)
    .then((result) => {
      let data = {};
      if (this.reportType == "Calendar View"){
        data = {dayShrinkValues: result, shrinkThreshold: this.shrinkThreshold, dateRangeStart: this.dateRangeStart.toISOString() };
        this.navCtrl.push(this.calendarPage, data);
      } else{
        data = { dayShrinkValues: result, dateRangeStart: this.dateRangeStart.toISOString() };
        this.navCtrl.push(this.LOTPage, data);
      }
      loader.dismiss();
    })
    .catch((err) => {
      console.log(err);
      loader.dismiss();
      let alert = this.alertCtrl.create({title: "Error",message: "An error occurred. Please try again.",buttons:['Dismiss']});
      alert.present();
    });
  }

  private onScanUPC(){
    this.scanner.androidScan()
    .then((UPC) => {
      this.subjectUPC = UPC;
      this.reportForm.controls["subjectUPC"].setValue(this.subjectUPC);
    })
    .catch((err) => {
      let errAlert = this.alertCtrl.create({title: 'Error',message: "An error occurred. Please try again.",buttons: ['Dismiss']});
      errAlert.present();
    })
  }


  private onSubjectSelectionChanged(){ //Function so that UPC is only required for single item selection
    if(this.subjectSelection == "SingleItem"){
      this.reportForm.addControl("subjectUPC", new FormControl(this.subjectUPC,
                              [
                                Validators.required,
                                Validators.pattern(/^\d{12}$/)
                              ]));
    }
    else{
      this.reportForm.removeControl("subjectUPC");
    }
  }

  private generateDummyData(calendar){
    //Calculate how many data points we need.
    this.AWSComm.AWSGetLossOverTime(this.dateRangeStart, this.dateRangeEnd, this.subjectSelection, this.subjectUPC)
    .then((result) => {
      this.logger.logCont(result, "generateDummyData");

      let dayInMilliseconds = 1000 * 60 * 60 * 24;
      let count = Math.round(Math.abs(this.dateRangeStart.getTime() - this.dateRangeEnd.getTime())/dayInMilliseconds);
      if(calendar){
        let data = { dayShrinkValues: [], shrinkThreshold: this.shrinkThreshold, dateRangeStart: this.dateRangeStart.toISOString() };
        // <= count so that it is inclusive both ways.
        for(let i = 0; i <= count; i++){
          data.dayShrinkValues.push(Math.random() * 1000);
        }
        return data;
      }
      else{
        let data = { dayShrinkValues: [], dateRangeStart: this.dateRangeStart.toISOString() };
        for(let i = 0; i <= count; i++){
          data.dayShrinkValues.push(Math.random() * 1000);
        }
        return data;
      }
    });


  }

}
