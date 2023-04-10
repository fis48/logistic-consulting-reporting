
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

import { DriverModel } from '../models/driverModel';
import { MedicalCenterModel } from '../models/medicalCenterModel';
import { TripModel } from '../models/tripModel';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.sass']
})
export class ReportFormComponent implements OnInit {

  @Input() drivers = new Input();
  @Input() medicalCenters = new Input();
  @Input() formTitle = new Input();
  @Input() onlyDates = new Input();
  @Input() patientDates? = new Input();
  @Input() driverSelector = new Input();
  @Output() sendFormData = new EventEmitter();
  @Input() patient = new Input();

  public medicalDriversSelectorsVisible:boolean = true;
  public patientFieldVisible:boolean = true;
  public datesVisible:boolean = false;
  public selectedMedicalCenterId:string | null = null;
  public strDateIni:string | null = null;
  public strPostDateIni:string | null = null;
  public strDateEnd:string | null = null;
  public strPostDateEnd:string | null = null;
  public selectorDrivers:DriverModel[] | null = null;
  public driverId:string = null;
  public isTodaysRequest:boolean = true;
  // public patientName:string | null = null;

  constructor(
    private mainService:MainService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.selectorDrivers = this.drivers;
    if (this.onlyDates === true) {
      this.medicalDriversSelectorsVisible = false;
    }
  }

  showDates(){
    this.datesVisible = !this.datesVisible;
  }

  setTodayDates() {
    const dates = this.mainService.setTodayDates();
    this.strPostDateIni = this.datePipe.transform(
      dates.dateIni, 
      'yyyy-MM-dd HH:ss').toString();
    this.strPostDateEnd = this.datePipe.transform( dates.dateEnd, 
      'yyyy-MM-dd 23:59').toString();

    // taking tomorrow dates
    // const now = moment();
    // const tomorrow = now.clone().add(1, "days");
    // this.isTodaysRequest = true;
    // this.strPostDateIni = this.datePipe.transform(
    //   tomorrow.toDate(), 
    //   'yyyy-MM-dd 00:00').toString();
    // this.strPostDateEnd = this.datePipe.transform( 
    //   tomorrow.toDate(), 
    //   'yyyy-MM-dd 23:59').toString();


  } 

  handleMedicalCenterFilter(e) {
    this.filterDrivers(e.target.value);
  }

  filterDrivers(mCenterId:string) {
    this.selectedMedicalCenterId = mCenterId;
    if (mCenterId !== '') {
      const filtered = this.drivers.filter( 
        (item:DriverModel) => item.IdMC.toString() === mCenterId.toString() );
      this.selectorDrivers = filtered;
    }
    else {
      this.selectorDrivers = this.drivers;
    }
  }

  handleDates() {
    if (this.strDateIni && this.strDateEnd) {
      const dateIni = new Date(this.strDateIni.replace('-', '/'));
      const dateEnd = new Date(this.strDateEnd.replace('-', '/'));
      this.isTodaysRequest = false;
      this.strPostDateIni = this.datePipe.transform(dateIni, 'yyyy-MM-dd HH:ss').toString();
      this.strPostDateEnd = this.datePipe.transform(dateEnd, 'yyyy-MM-dd 23:59').toString();
    }

    if (!this.strPostDateIni || !this.strPostDateEnd) {
      this.setTodayDates();
    }
  }

  sendForm() {
    this.handleDates();
    if (!this.selectedMedicalCenterId && this.onlyDates !== true ) {
      alert('You must select a medical center.');
      return;
    }
    this.sendFormData.emit({
      driverId: this.driverId,
      selectedMedicalCenterId: this.selectedMedicalCenterId,
      strPostDateIni: this.strPostDateIni,
      strPostDateEnd: this.strPostDateEnd,
      isTodaysRequest: this.isTodaysRequest,
      patientName: this.patient.Names,
      patientId: this.patient.Id
    });
  }

}
