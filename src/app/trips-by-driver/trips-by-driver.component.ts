import { Component, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

import * as html2pdf from 'html2pdf.js';

import { MedicalCenterModel } from '../models/medicalCenterModel';
import { ReportByDriverTopModel } from '../models/reportByDriverTopModel';
import { TripModel } from '../models/tripModel';
import { MainService } from '../services/main.service';
import { ReportByDriverItemModel } from '../models/reportByDriverItemModel';
import { DriverModel } from '../models/driverModel';

@Component({
  selector: 'app-trips-by-driver',
  templateUrl: './trips-by-driver.component.html',
  styleUrls: ['./trips-by-driver.component.sass']
})

export class TripsByDriverComponent implements OnInit {

  @Input() api_token = new Input();
  @Input() drivers = new Input();
  @Input() medicalCenters = new Input();
  
  public trips:TripModel[] | null = null;
  public reportTop:ReportByDriverTopModel | null = null;
  public tripsItems: any[] | null = null;
  public sendVisible:boolean = false;
  public formData:any | null = null;

  constructor(
    private mainService:MainService,
    private datePipe:DatePipe
  ) { }

  ngOnInit(): void {
  }

  setFormData(data) {
    this.formData = data;
    this.getReport();
  }

  getReport() {
    this.mainService.getTripsByDriver(
      Number(this.formData.driverId), 
      Number(this.formData.selectedMedicalCenterId),
      this.formData.strPostDateIni,
      this.formData.strPostDateEnd,
      this.formData.isTodaysRequest).subscribe(
      (result:any) => {
        const resTrips = [];
        result.trips.forEach((element:any) => {
          resTrips.push(this.mainService.anyToTrip(element));
        });
        const realTrips = resTrips.
          filter(item => item.confirmstatus === "Confirmed" && item.resourcename2 === "TRANSPORT - YES");
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
        )
        this.setReport(formated);
      },
      e => console.log(e)
    );
  }

  setReport(formated:any) {
    this.tripsItems = [];
    formated.forEach((formatedItem:any) => {
      if (formatedItem.driver) {
        let tripsItems:ReportByDriverItemModel[] = [];
        let reportTop = new ReportByDriverTopModel();
        let tripElement:any = {};
  
        formatedItem.trips.forEach((trip:any) => {
          const tripItem:ReportByDriverItemModel = new ReportByDriverItemModel();
          tripItem.trip_id = trip.id.toString();
          const pickupDate = new Date(trip.Date + ' ' + trip.Time);
          const timeAMPM = this.datePipe.transform(pickupDate, "h:mm a");
          tripItem.pickup_time = timeAMPM;
          tripItem.patient_name = trip.FirstName + ' ' + trip.LastName;
          tripItem.patient_phones = `${trip.PhoneNumber} ${trip.MobilNumber}`;
          tripItem.pickup_location = trip.AddressPatient;
          tripItem.special_requirement = trip.special_requirement;
          tripItem.destination = trip.AddressDestination;
          tripItem.comments = trip.comment;
          tripItem.resourcename1 = trip.resourcename1;
          tripsItems.push(tripItem);          
        });
        tripsItems.sort((a, b) => a.patient_name.toLowerCase()
          .localeCompare(b.patient_name.toLowerCase()));
        reportTop.center = formatedItem.mc.Name;
        const now = new Date();
        reportTop.date = this.datePipe.transform(now, 'MMMM dd, YYYY');
        reportTop.name = formatedItem.driver.Driver;
        reportTop.zone = formatedItem.driver.dZone;
        reportTop.vehicle = formatedItem.driver.IdVehicle;
        reportTop.timeout = this.datePipe.transform(now, 'h:mm a');
        
        tripElement.reportTop = reportTop;
        tripElement.tripsItems = tripsItems;
        this.tripsItems.push(tripElement);        
      }
    });
  }

  handleExportPdf() {
    const element = document.getElementById('report-container');
    const opt = {
      margin:       10,
      filename:     'by_driver_report.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 3 },
      jsPDF:        { unit: 'mm', format: 'letter', orientation: 'landscape' },
      pagebreak:    { after: '.rep-driver-container', avoid: 'p' }
    };
    const worker = html2pdf().from(element).set(opt).save();
    worker.then((result) => {
      
      console.log(result);

    }).catch((err) => {
      
      console.log(err);
      
    });
  }
}
