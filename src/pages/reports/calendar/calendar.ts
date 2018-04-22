import { Component, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage implements OnInit {
  eventSource = [];
  viewTitle: string;
  selectedDay = new Date();
  shrinkThreshold = 0;

  public calendar = {
    mode: 'month',
    currentDate: new Date()
  };

  constructor(private navParams: NavParams) {}

  ngOnInit(){
    let specs = this.navParams.data;
    let dayShrinkValues = specs.dayShrinkValues
    this.calendar.currentDate = new Date(specs.dateRangeStart);
    this.shrinkThreshold = specs.shrinkThreshold;

    for(let i = 0; i < dayShrinkValues.length; i++){
      this.eventSource.push({
        title: "Test " + (i+1).toString(),
        startTime: this.genDate(i),
        endTime: this.genDate(i),
        allDay: true,
        loss: dayShrinkValues[i].toFixed(2)
      });
    }
    let events = this.eventSource;
    this.eventSource = [];
    setTimeout(() => {
      this.eventSource = events;
    }, 100);
  }

  private genDate(dayOffset){
    let date = this.calendar.currentDate;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + dayOffset);
  }

  private getColor(events){
    if(events.length > 0 && parseFloat(events[0].loss) >= this.shrinkThreshold){
      return 'overShrinkLimit';
    }
    return '';
  }

  private onViewTitleChanged(title){
    this.viewTitle = title;
  }

  private onTimeSelected(event){
    this.selectedDay = event.selectedTime;
  }

}
