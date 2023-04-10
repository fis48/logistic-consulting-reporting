import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';
import { TripModel } from '../models/tripModel';
import { IReportAllTripsItem, IReportAllTripsTop } from '../models/IReportAllTrips';
import { MedicalCenterModel } from '../models/medicalCenterModel';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-all-trips',
  templateUrl: './all-trips.component.html',
  styleUrls: ['./all-trips.component.sass']
})
export class AllTripsComponent implements OnInit {

  @Input() drivers = new Input();
  @Input() medicalCenters = new Input();

  public formData:any | null = null;
  public formVisible:boolean = false;
  public reportVisible:boolean = false;
  public reportTop:IReportAllTripsTop = null;
  public reportItems:IReportAllTripsItem[] = null;

  constructor(
    private mainService:MainService,
    private datePipe:DatePipe
  ) { }

  ngOnInit(): void {
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
        this.formData.isTodaysRequest )
      .subscribe(
        (result:any) => {
          const resTrips:TripModel[] = [];
          result.trips.forEach((element:any) => {
            if (element.TripType === "A") {
              resTrips.push(this.mainService.anyToTrip(element));
            }
          });

          const medicalCenterGrouped = resTrips.reduce((acc, item) => {
            if (!acc[item.IdMC]) {
              acc[item.IdMC] = [];
            }
            acc[item.IdMC].push(item);
            return acc;
          }, {})

          const formatted = this.mainService.formatAllTrips(
            medicalCenterGrouped, 
            this.medicalCenters, 
            this.drivers);
            
          this.setReport(formatted);
        }
      );
  }

  setReport(formatted:any) {
    this.reportItems = [];
    formatted.forEach((fItem:{ medicalCenter:MedicalCenterModel, drivers:[] }) => {
      const item:IReportAllTripsItem = {
        center_name: fItem.medicalCenter.Name,
        drivers: this.getFormattedDrivers(fItem.drivers),
        scheduled: this.getCenterScheduled(fItem.drivers),
        completed: this.getCenterCompleted(fItem.drivers),
        cancelled: this.getCancelled(
          formatted, 
          this.getCenterScheduled(fItem.drivers),
          fItem.medicalCenter.IdMedicalC
        )
      }
      this.reportItems.push(item);
    });
    this.setTopValues(formatted, this.reportItems);
  }

  getFormattedDrivers(drivers:any[]): { 
    name:string; 
    scheduled:number;
    completed: { percentage:string; total:string; };
    cancelled: { percentage:string; total:string; } }[] {
      const fDrivers = [];
      drivers.forEach(drItem => {
        const sched = drItem.trips.length;
        const compl = this.getDriverCompleted(drItem);
        const cancelled = drItem.trips.filter( item => item.CD !== null );
        const canc = { 
          percentage: ((cancelled.length / sched)*100).toFixed(2),
          total: cancelled.length.toString() 
        };
        if (drItem.driver) {
          const driver = {
            name: drItem.driver.Driver,
            scheduled: sched,
            completed: compl,
            cancelled: canc
          }
          fDrivers.push(driver);
        }
    });
    return fDrivers;
  }

  getCenterScheduled(drivers:[]): number {
    let scheduled:number = 0;
    drivers.forEach((element:any) => {
      scheduled += element.trips.length;
    });
    return scheduled;
  }

  setTopValues(formatted:any, reportItems:any) {
    this.reportTop = {
      title: 'ALL TRIPS INFO',
      total_trips: 0,
      completed: {
        total: '0',
        percentage: '0'
      },
      cancelled: {
        total: '0',
        percentage: '0'
      },
      timeout: new Date(),
      dates: { dateIni: null, dateEnd: null }
    }

    let totalTrips = 0;
    formatted.forEach((item:any) => {
        item.drivers.forEach(drItem => {
        totalTrips += drItem.trips.length;
      });
    });

    const dateIni = new Date(this.formData.strPostDateIni);
    const dateEnd = new Date(this.formData.strPostDateEnd);

    this.reportTop.total_trips = totalTrips;
    this.reportTop.cancelled = this.getCancelled(formatted, totalTrips);
    this.reportTop.completed = this.getTopCompleted(reportItems, totalTrips);
    this.reportTop.dates = { dateIni, dateEnd };
  }

  getCenterCompleted(drivers:any): { percentage:string; total:string } {
    let percentageNumber = 0;
    let totalNumber = 0;
    drivers.forEach((driverItem:any) => {
      const completed = driverItem.trips.find(item => item.RP !== null);
      if (completed) {
        totalNumber += 1;
      }
    });
    return {
      percentage: `${(totalNumber/drivers.length) * 100}`,
      total: `${totalNumber}`
    };
  }

  getDriverCompleted(drItem:any) {
    if (drItem.driver) {
      let drTotal = 0;
      let drPercentage = 0;
      drItem.trips.forEach(drItemTrip => {
        if (drItemTrip.OB !== null) {
          drTotal += 1;
        }
      });
      return {
        percentage: `${ ((drTotal/drItem.trips.length)*100).toFixed(2) }`,
        total: `${drTotal}`
      }
    }
  }

  getTopCompleted(reportItems:any, totalTrips:number) {
    let total = 0;
    let percentage = 0;
    reportItems.forEach(rItem => {
      total += Number(rItem.completed.total);
    });
    return {
      total: `${total}`,
      percentage: `${((total/totalTrips)*100).toFixed(2)}%`
    }
  }

  getCancelled(formatted:any, cTotal:number, ofItem:number = null): { percentage:string; total:string } {
    let cancelled = 0;
    if (!ofItem) {
      formatted.forEach((fItem:any) => {
        fItem.drivers.forEach((drItem:any) => {
          const found = drItem.trips.filter((item:any) => item.CD !== null);
          cancelled += found.length
        });
      });
    }
    else {
      formatted.forEach((fItem:any) => {
        if (fItem.medicalCenter.IdMedicalC === ofItem) {
          fItem.drivers.forEach((drItem:any) => {
            const found = drItem.trips.filter((item:any) => item.CD !== null);
            cancelled += found.length;
          });
        }
      });
    }
    return {
      percentage: ( (cancelled / cTotal) * 100 ).toFixed(2),
      total: cancelled.toString()
    }
  }

  setFormData(data:any) {
    this.formData = data;
    this.setDates();
    this.reportVisible = true;
    this.getReport();
  }

  handleExportPdf() {
    const element = document.getElementById('report-container');
    const opt = {
      margin:       10,
      filename:     'all_trips_report.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 3 },
      jsPDF:        { unit: 'mm', format: 'letter', orientation: 'landscape' },
      pagebreak:    { avoid: 'div' }
    };
    const worker = html2pdf().from(element).set(opt).save();
  }  

}
