
import { Component, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as html2pdf from 'html2pdf.js';

import { ReportCancellationsItemModel } from '../models/reportCancellationsItemModel';
import { ReportCancellationsTopModel } from '../models/reportCancellationsTopModel';
import { TripModel } from '../models/tripModel';
import { MainService } from '../services/main.service';
import { DriverModel } from '../models/driverModel';

@Component({
  selector: 'app-cancellations',
  templateUrl: './cancellations.component.html',
  styleUrls: ['./cancellations.component.sass']
})
export class CancellationsComponent implements OnInit {

  @Input() api_token = Input();
  @Input() medicalCenters = Input();
  @Input() drivers = Input();

  public formData:any | null = null;
  public reportTrips:TripModel[] = [];
  public reportItems: any[] | null = null;
  public totalCancellations = 0;
  public reportVisible:boolean = false;

  constructor(
    private mainService:MainService,
    private datePipe:DatePipe
  ) { }

  ngOnInit(): void {
    // this.selectorDrivers = this.drivers;
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

  setFormData(data) {
    this.formData = data;
    this.setDates();
    this.reportVisible = true;
    this.getReport();
  }

  getReport() {
    this.mainService.getCancellations(
      Number(this.formData.driverId),
      Number(this.formData.selectedMedicalCenterId),
      this.formData.strPostDateIni,
      this.formData.strPostDateEnd,
      this.formData.isTodaysRequest
    ).subscribe(
      ( result:any ) => {
        const resTrips = [];
        result.found.forEach((element:any) => {
          const trip = this.mainService.anyToTrip(element);
          const date = new Date(trip.Date + ' ' + trip.Time);
          const timeAMPM = this.datePipe.transform(date, "h:mm a");
          trip.Time = timeAMPM;
          resTrips.push(trip);
        });
        const realTrips = resTrips.
          filter(item => item.confirmstatus === "Cancelled" && item.resourcename2 === "TRANSPORT - YES");
        const grouped = realTrips.reduce((acc, item) => {
          if (!acc[item.driver_id]) {
            acc[item.driver_id] = [];
          }
          acc[item.driver_id].push(item);
          return acc;
        }, {});

        const formated = this.mainService.formatReportData(
          grouped,
          this.medicalCenters,
          this.formData.selectedMedicalCenterId,
          this.drivers
        );
        this.reportItems = [];
        this.reportItems = formated;
        this.setTotalCancellations();
      },
      (error) => {
        console.log('Error getting medical center cancellations: ' + error.message);
      }
    );
  }

  setTotalCancellations() {
    this.totalCancellations = 0;
    this.reportItems.forEach(repItem => {
      repItem.trips.forEach((trip:TripModel) => {
        this.totalCancellations += 1;
      });
    });
  }

  handleExportPdf() {
    const element = document.getElementById('report-container');
    const opt = {
      margin:       10,
      filename:     'cancellations_report.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 3 },
      jsPDF:        { unit: 'mm', format: 'letter', orientation: 'landscape' },
      pagebreak:    { avoid: 'div' }
    };
    const worker = html2pdf().from(element).set(opt).save();
  }  

}
