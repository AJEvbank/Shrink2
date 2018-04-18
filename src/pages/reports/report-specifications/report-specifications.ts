import { Component, OnInit } from '@angular/core';
import { NavParams, NavController, AlertController } from 'ionic-angular';
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
  maxAllowedShrink = "";

  //Shared by all
  reportForm : FormGroup;
  subjectSelection = "";
  subjectUPC = "";
  dateRangeStart = new Date();
  dateRangeEnd = new Date();
  isLocalHost = false;
  AWSComm : AWSCommService | AWSCommBrowserService;



  constructor(private navParams: NavParams,
              private navCtrl: NavController,
              private scanner: ScannerService,
              private alertCtrl: AlertController,
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
        "maxAllowedShrink": new FormControl(this.maxAllowedShrink, Validators.pattern(/^\d{0,9}(?:\.(?:\d{0,2}))?$/))
      });
    }
  }

  private onSubmit(){
    let value = this.reportForm.value;
    this.subjectSelection = value.subjectSelection;
    if(this.subjectSelection == "SingleItem"){
      this.subjectUPC = value.subjectUPC;
    }
    this.dateRangeStart = value.dateRangeStart;
    this.dateRangeEnd = value.dateRangeEnd;
    if(this.reportType == ""){
      this.maxAllowedShrink = value.maxAllowedShrink;
    }


    this.errorMessage = "";
    if(this.dateRangeEnd < this.dateRangeStart){
      this.errorMessage = "End date must be equal to or later than the start date.";
      return false; //Not actually necessary.
    }

    //Server stuff.
    let data = this.generateDummyData();
    this.navCtrl.push(this.LOTPage, data);
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

  private generateDummyData(){
    let throwaways : Throwaway[] = [];
    let testIR = new ItemRecord("Test Name", "123456789012", false);
    let testIC = new ItemCollection(testIR, 10, 4);
    throwaways.push(new Throwaway(testIC, new Date("4/1/18")))
    testIR = new ItemRecord("Test Name 2", "123456789012", false);
    testIC = new ItemCollection(testIR, 10, 4);
    throwaways.push(new Throwaway(testIC, new Date("4/2/18")))
    testIR = new ItemRecord("Test Name 3", "123456789012", false);
    testIC = new ItemCollection(testIR, 10, 4);
    throwaways.push(new Throwaway(testIC, new Date("4/3/18")))
    return throwaways;
  }
}
