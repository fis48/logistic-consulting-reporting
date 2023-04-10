import { DatePipe } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';

import { MainService } from '../services/main.service';
import { IReportKpiItem, IReportKpiTop } from '../models/IReportKpi';
import { KpiResultItem } from '../models/kpiResultItem';
import { TripModel } from '../models/tripModel';
import * as html2pdf from 'html2pdf.js';
import { MedicalCenterModel } from '../models/medicalCenterModel';
import { IReportKpiReturnItem } from '../models/IReportKpiReturn';

@Component({
  selector: 'app-kpi',
  templateUrl: './kpi.component.html',
  styleUrls: ['./kpi.component.sass']
})
export class KpiComponent implements OnInit {

  @Input() drivers = new Input();
  @Input() medicalCenters = new Input();

  public formData:any | null = null;
  public reportVisible:boolean = false;
  public reportTop:IReportKpiTop = null;
  public reportItems:IReportKpiItem[] = null;
  public reportReturnItems:IReportKpiReturnItem[] = null;
  public tripsAChart:any[] = [];
  public tripsBChart:any[] = [];

  public chartData:any = [];
  public chartBData:any = [];
  public chartColumns:any = ['title', 'Transit', 'Pending', 'Completed', 'Cancelled'];
  public chartOptions = {
    isStacked: true,
    colors: ['#8FE3CF', '#FFEA11', '#A10035', '#80558C'],
    chartArea: { width: '60%', height: '50%' }
  }

  constructor(
    private mainService:MainService,
    private datePipe:DatePipe
  ) { 
    this.chartData = null;
    this.chartBData = null;
  }

  ngOnInit(): void {
  }

  getReport() {
    this.mainService.getKpi(
      this.formData.strPostDateIni, 
      this.formData.strPostDateEnd,
      this.formData.selectedMedicalCenterId,
      this.formData.driverId,
      this.formData.isTodaysRequest
      )
      .subscribe(
        (result:any ) => {
          const completed:KpiResultItem[] = [];
          const realFound = result.found.filter((item:any) => item.resourcename2 === "TRANSPORT - YES");
          realFound.forEach((element:any) => {
            if (element.RP !== null) {
              const newDate = new Date(element.RP);
              let item:KpiResultItem = {
                id: element.id,
                IdMC: element.IdMC,
                Date: element.Date,
                CD: element.CD,
                OB: element.OB,
                RAP: newDate,
                Time: element.Time,
                FirstName: element.FirstName,
                LastName: element.LastName,
                AddressPatient: element.AddressPatient,
                PhoneNumber: element.PhoneNumber,
                MobilNumber: element.MobilNumber,
                AddressDestination: element.AddressDestination,
                ConsultDestination: element.ConsultDestination,
                Driver: element.Driver,
                TripType: element.TripType,
                driver_id: element.driver_id,
                resourcename1: element.resourcename1,
                resourcename2: element.resourcename2,
                confirmstatus: element.confirmstatus
              }
              completed.push(item);
            }
          });
          this.setReport(completed, result.found);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  setTopValues(completed:KpiResultItem[], trips:TripModel[]) {
    const medicalCenter = this.medicalCenters.find( 
      (item:MedicalCenterModel) => item.IdMedicalC === Number(this.formData.selectedMedicalCenterId) );

      this.reportTop = {
      title: 'KEY PERFORMANCE INDICATORS',
      medical_center: medicalCenter.Name,
      total_trips: 0,
      completed: {
        total: '0',
        percentage: '0'
      },
      timeout: new Date(),
      dates: { dateIni: null, dateEnd: null },
      onTime: {
        late: { total:'0', percentage: '0' },
        on_time: { total:'0', percentage: '0' }
      }
    }

    let totalTrips = 0;
    trips.forEach((item:any) => {
      totalTrips += 1;
    });

    const dateIni = new Date(this.formData.strPostDateIni);
    const dateEnd = new Date(this.formData.strPostDateEnd);
    this.reportTop.total_trips = totalTrips;
    this.reportTop.dates = { dateIni, dateEnd };
    this.reportTop.completed.total = completed.length.toString();
    this.reportTop.completed.percentage = 
      ((completed.length / this.reportTop.total_trips) * 100).toFixed(2) + "%"
  }

  getCancelled(formatted:any, cTotal:number, ofItem:number = null): { percentage:string; total:string } {
    let cancelled = 0;
    const found = formatted.filter( item => item.CD !== null ).length;
    const total = formatted.length;

    return {
      percentage: ((found / total)*100 ).toFixed(2),
      total: total.toString()
    }
  }

  setReportItems(formatted:KpiResultItem[]): IReportKpiItem[] {
    const completed = [];
    formatted.forEach(element => {
      if (element.RAP !== null) {
        completed.push(element);
      }
    });

    const tableItems:IReportKpiItem[] = [];
    let lateTotal:number = 0;
    let aTripsTotal:number = 0;
    completed.forEach((compItem:any) => {
      const appointmentDate = new Date(compItem.Date + ' ' + compItem.Time);
      const obPickDate = new Date(compItem.OB);
      let onTime = 'Yes'
      if (appointmentDate < compItem.RAP) {
        onTime = 'No'
      }

      const item:IReportKpiItem = {
        trip_type: compItem.TripType,
        patient_name: compItem.FirstName + ' ' + compItem.LastName,
        appointment_date: this.datePipe.transform(appointmentDate, 'HH:mm a, dd-MM-yy'),
        ob: this.datePipe.transform(obPickDate, 'HH:mm a'),
        dp: this.datePipe.transform(compItem.RAP, 'HH:mm a'),
        driver: compItem.Driver,
        on_time: onTime
      }
      if (compItem.TripType === "A") {
        aTripsTotal += 1;
      }
      if ((appointmentDate < compItem.RAP) && (compItem.TripType === "A")) {
        lateTotal += 1;
      }
      tableItems.push(item);
    });
    this.reportTop.onTime.late.total = lateTotal.toString();
    this.reportTop.onTime.late.percentage = ((lateTotal / aTripsTotal)*100).toFixed(2);
    this.reportTop.onTime.on_time.total = (aTripsTotal - lateTotal).toString();
    this.reportTop.onTime.on_time.percentage = (((aTripsTotal - lateTotal) / aTripsTotal))
      .toFixed(2);

    this.reportItems = tableItems;
    return tableItems;
  }

  setReportReturnItems(completed:KpiResultItem[]) {
    const returns = completed.filter(item => item.TripType === "B");
    let returnItems:IReportKpiReturnItem[] = [];
    returns.forEach(rItem => {
      let item:IReportKpiReturnItem = {
        patient_name: rItem.FirstName,
        ob: rItem.OB,
        dp: rItem.RAP,
        driver: rItem.Driver
      }
      item.ob = new Date(item.ob);
      item.dp = new Date(item.dp);
      returnItems.push(item);
    });
    this.reportReturnItems = returnItems;
    return returnItems;
  }

  setReport(completed:KpiResultItem[], trips:TripModel[]) {
    this.setTopValues(completed, trips);
    this.setReportItems(completed);
    this.setReportReturnItems(completed);
    this.chartData = this.setAChartInfo(trips);
    this.chartBData = this.setBChartInfo(trips);
  }

  setAChartInfo(trips:any) {
    const aType = trips.filter( (item:any) => item.TripType === "A" );
    const onBoard = aType.filter( (item:any) => item.OB !== null && item.RP === null );
    const pending = aType.filter( (item:any) => item.OB === null && item.CD === null );
    const cancelled = aType.filter( item => item.CD !== null );
    const completed = aType.filter( item => item.RP !== null );

    return [
      [ 'Transit', onBoard.length, 0, 0, 0 ],
      [ 'Pending', 0, pending.length, 0, 0 ],
      [ 'Completed', 0, 0, completed.length, 0 ],
      [ 'Cancelled', 0, 0, 0, cancelled.length ]
    ]
  }

  setBChartInfo(formatted:any) {
    const bType = formatted.filter( (item:any) => item.TripType === "B" );
    const onBoard = bType.filter( (item:any) => item.OB !== null && item.RP === null );
    const pending = bType.filter( (item:any) => item.OB === null && item.CD === null );
    const cancelled = bType.filter( (item:any) => item.CD !== null );
    const completed = bType.filter( (item:any) => item.RP !== null );

    return [
      [ 'Transit', onBoard.length, 0, 0, 0 ],
      [ 'Pending', 0, pending.length, 0, 0 ],
      [ 'Completed', 0, 0, completed.length, 0 ],
      [ 'Cancelled', 0, 0, 0, cancelled.length ]
    ]
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

  handleExportPdf() {
    const element = document.getElementById('report-container');
    const opt = {
      margin:       10,
      filename:     'kpi_report.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 3 },
      jsPDF:        { unit: 'mm', format: 'letter', orientation: 'landscape' },
      pagebreak:    { avoid: 'div' }
    };
    const worker = html2pdf().from(element).set(opt).save();
  }  


}
