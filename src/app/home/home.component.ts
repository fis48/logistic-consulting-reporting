import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DriverModel } from '../models/driverModel';
import { MedicalCenterModel } from '../models/medicalCenterModel';
import { TripModel } from '../models/tripModel';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  public actualReportType:string | null = null;
  private api_token = null;
  public allTrips:TripModel[] | null = null;
  public medicalCenters:MedicalCenterModel[] | null = null;
  public drivers:DriverModel[] | null = null;

  constructor(
    private mainService:MainService,
    private router:Router
  ) { }

  ngOnInit(): void {    
    this.api_token = localStorage.getItem('api_token');
    
    // medical centers
    this.getMedicalCenters();

    // drivers
    // this.getDrivers(this.api_token);
    this.getDrivers();
  }

  getMedicalCenters() {
    this.medicalCenters = [];
    this.mainService.getMedicalCenters()
    .subscribe(
      (result:any) => {
        result.medicalCenters.forEach(element => {
          const mc = this.mainService.anyToMedicalCenter(element);
          this.medicalCenters.push(mc);
        });
      },
      (error) => {
        if (error) {
          this.router.navigate(['/']);
        }
        console.log(error);
      }
    );
  }

  getDrivers() {
    this.mainService.getDrivers().subscribe(
      (result:any) => {
        this.drivers = [];
        result.drivers.forEach(element => {
          this.drivers.push(this.mainService.anyToDriver(element));
        });
      },
      (e) => {
        console.log('Error getting drivers: ' + e.message);
      }
    );
  }

  setReportType(type:string) {
    this.actualReportType = type;
    switch (type) {
      case 'clear':
        this.actualReportType = null;
      break;
    }
  }

}
