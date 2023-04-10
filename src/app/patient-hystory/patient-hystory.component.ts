import { Component, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';

import { MainService } from '../services/main.service';
import { TripModel } from '../models/tripModel';
import { PatientModel } from '../models/patientModel';
import { ITopPatient } from '../models/IReportPatient';

@Component({
  selector: 'app-patient-hystory',
  templateUrl: './patient-hystory.component.html',
  styleUrls: ['./patient-hystory.component.sass']
})
export class PatientHystoryComponent implements OnInit {
  patientTrips:TripModel[] = null;
  patients:PatientModel[] = null;
  reportPatient: PatientModel = null;
  searchPatients: PatientModel[] = [];
  todayTrips:TripModel[] = null;
  searchStr:string = "";
  strDateIni: string;
  strDateEnd: string;
  reportVisible: boolean = false;
  reportTop: ITopPatient;

  constructor(
    private mainService:MainService
  ) { }

  ngOnInit(): void {
    this.getPatientsList();
  }

  getPatientsList() {
    this.mainService.getAllPatients().subscribe((result:any) => {
      const { patients } = result;
      this.patients = patients;
      this.searchPatients = patients;
    });
  }

  getTodayTrips() {
    const now = new Date();
    const nowFormat = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "2-digit", day: "2-digit" });
    const parts = nowFormat.formatToParts();
    const dateIni = `${parts[4].value}-${parts[0].value}-${parts[2].value} 00:00:00`;
    const dateEnd = `${parts[4].value}-${parts[0].value}-${parts[2].value} 23:59:59`;
    this.mainService.getAllTrips(dateIni, dateEnd, true).subscribe(
      (result:any) => {
        const allTrips = result.trips.map(trip => this.mainService.anyToTrip(trip));
        this.todayTrips = allTrips;
      },
      (error) => {
        console.log("Error getting all trips:", error);
      }
    );
  }

  setFormData(formData:any) {
    this.reportVisible = true;
    this.mainService.getPatientHistory(formData)
      .subscribe(
      (result:any) => {
        const { found } = result;
        this.patientTrips = found.map((trip:TripModel) => this.mainService.anyToTrip(trip));
        this.reportTop = {
          title: "Patient report",
          dates: { dateIni: formData.strPostDateIni, dateEnd: formData.strPostDateEnd },
          totalTrips: found.length,
          timeout: new Date()
        }
      },
      (error) => {
        console.log("Error getting patient history:", error);
      }
    );
  }

  searchPatient() {
    const found = this.patients.filter( item => {
      const lowerItem = item.Names.toLowerCase();
      const lowerSearch = this.searchStr.toLowerCase();
      if (lowerItem.includes(lowerSearch)) {
        return item;
      }
    });
    this.searchPatients = found;
    if (this.searchStr === "") {
      this.searchPatients = this.patients;
    }
  }

  setReportPatient(selected:PatientModel) {
    this.reportPatient = selected;
    const searchField = document.querySelector("#patient-name");
    this.searchStr = this.reportPatient.Names;
  }

  handleExportPdf() {
    const element = document.getElementById('report-container');
    const opt = {
      margin:       10,
      filename:     'patient_report.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 3 },
      jsPDF:        { unit: 'mm', format: 'letter', orientation: 'landscape' },
      pagebreak:    { avoid: 'div' }
    };
    const worker = html2pdf().from(element).set(opt).save();
  }  


}
