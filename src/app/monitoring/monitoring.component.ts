import { Component, Input, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';
import { DatePipe } from '@angular/common';
import * as html2pdf from 'html2pdf.js';

import { TripModel } from '../models/tripModel';
import { IMonitoringTop, IMonitoringColumn, IMonitoringResult } from '../models/IReportMonitoring';
import { MedicalCenterModel } from '../models/medicalCenterModel';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.sass']
})
export class MonitoringComponent implements OnInit {

  @Input() drivers = new Input();
  @Input() medicalCenters = new Input();

  public formData:any | null = null;
  public reportVisible:boolean = false;
  public tripTypeSelected: string | null = null;
  public reportTop:IMonitoringTop = {} as IMonitoringTop;
  public reportItems: IMonitoringResult
  public formVisible:boolean = false;


  constructor(
    private mainService:MainService,
    private datePipe:DatePipe
  ) { }

  ngOnInit(): void {
  }

  setTripType(tripType:string) {
    this.tripTypeSelected = tripType;
    this.formVisible = true;
    let strType = 'Pickup';
    if(this.tripTypeSelected === 'B') {
      strType = 'Return'
    }
    this.reportTop.title = `Monitoring ${ strType } Trips`;
  }

  setFormData(data:any) {
    this.formData = data;
    this.setDates();
    this.reportVisible = true;
    this.getReport();
  }

  setDates() {
    const dates = this.mainService.setTodayDates();
    if (dates) {
      this.formData.strDateIni = this.datePipe.transform(dates.dateIni, 'yyyy-MM-dd HH:mm');
      this.formData.strDateEnd = this.datePipe.transform(dates.dateEnd, 'yyyy-MM-dd 23:59');
    }
    else {
      // this.datesSelectorsVisible = true;
    }
  }

  getReport() {
    this.mainService.getAllTrips(
      this.formData.strPostDateIni, 
      this.formData.strPostDateEnd,
      this.formData.isTodaysRequest)
      .subscribe(
        (result:any) => {
          this.setReportTop(result.trips);
          this.setReportItems(result.trips);
        }
      );
  }

  setReportTop(allTrips:TripModel[]): void {
    const medicalCenter = this.medicalCenters.find( 
      (item:MedicalCenterModel) => item.IdMedicalC === Number(this.formData.selectedMedicalCenterId));
    this.reportTop.medical_center = medicalCenter.Name;
    this.reportTop.date = new Date(this.formData.strPostDateIni)
    const typeTrips = allTrips.filter(item => item.TripType === this.tripTypeSelected);
    const realTrips = typeTrips.filter(item => item.resourcename2 === "TRANSPORT - YES");

    console.log("rep top type:", this.tripTypeSelected);
    console.log("real:", realTrips);
    console.log("type trips:", typeTrips);

    // this.reportTop.total_trips = allTrips.length;
    this.reportTop.total_trips = realTrips.length;
    this.reportTop.timeout = new Date();
  }

  setReportItems(allTrips:TripModel[]) {
    let trips = allTrips.filter( (item:any) => item.TripType === this.tripTypeSelected);
    const realTrips = trips.filter(item => item.resourcename2 === "TRANSPORT - YES");
    const pending = realTrips.filter( (item:any) => item.OB === null && item.CD === null );
    const onBoard = realTrips.filter( (item:any) => item.OB !== null && item.OB === null );
    const completed = realTrips.filter( (item:any) => item.RP !== null );
    const canceled = realTrips.filter( (item:any) => item.CD !== null );

    const pendingCol:IMonitoringColumn = {
      title: 'Pending',
      total: pending.length,
      percentage: `${((pending.length / realTrips.length)*100).toFixed(2)} %`,
      trips: pending
    }
    const onBoardCol:IMonitoringColumn = {
      title: 'On the way',
      total: onBoard.length,
      percentage: `${((onBoard.length / realTrips.length)*100).toFixed(2)} %`,
      trips: onBoard
    }
    const completedCol:IMonitoringColumn = {
      title: 'Completed',
      total: completed.length,
      percentage: `${((completed.length / realTrips.length)*100).toFixed(2)} %`,
      trips: completed
    }
    const canceledCol:IMonitoringColumn = {
      title: 'Canceled',
      total: canceled.length,
      percentage: `${((canceled.length / realTrips.length)*100).toFixed(2)} %`,
      trips: canceled
    }

    this.reportItems = {
      pending: pendingCol,
      onBoard: onBoardCol,
      completed: completedCol,
      canceled: canceledCol
    }
  }

  handleExportPdf() {
    const element = document.getElementById('report-container');
    const opt = {
      margin:       10,
      filename:     'monitoring_status_report.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 3 },
      jsPDF:        { unit: 'mm', format: 'letter', orientation: 'landscape' },
      pagebreak:    { avoid: 'div' }
    };
    const worker = html2pdf().from(element).set(opt).save();
  }    
}
