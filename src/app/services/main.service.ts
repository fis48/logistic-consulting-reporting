
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { MedicalCenterModel } from '../models/medicalCenterModel';
import { DriverModel } from '../models/driverModel';
import { TripModel } from '../models/tripModel';
import { DatePipe } from '@angular/common';



@Injectable({
  providedIn: 'root'
})
export class MainService {

  // private baseUrl = 'http://localhost:4000'
  private baseUrl = 'https://report-dev.sacs-web.com';

  constructor(
    private http:HttpClient,
    private datePipe:DatePipe
  ) { }

  login(email:string, pass:string) {
    // let path = '/api/login';
    let path = '/api/auth/login';
    let loginData = {
      email:email,
      password:pass
    }

    return this.http.post(
      this.baseUrl + path,
      loginData,
    );
  }

  getMedicalCenters() {
    const path = '/api/reporting/get-medical-centers'
    return this.http.get(this.baseUrl + path);
  }

  getDrivers() {
      const path = '/api/reporting/get-drivers';
      return this.http.get(this.baseUrl + path);    
  }

  anyToMedicalCenter(element) {
    let medicalCenter = new MedicalCenterModel();
    medicalCenter.AddressMedicalC = element.AdderssMedicalC;
    medicalCenter.IdMedicalC = element.IdMedicalC;
    medicalCenter.Name = element.Name;
    medicalCenter.Specialty = element.Specialty;
    return medicalCenter;
  }

  anyToDriver(data:any) {
    let driver:DriverModel = {
      Driver:data.Driver,
      Id:data.Id,
      IdMC:data.IdMC,
      IdVehicle:data.IdVehicle,
      dZone:data.dZone,
      east:data.east,
      north:data.north,
      south:data.south,
      user_id:data.user_id,
      west:data.west
    }
    return driver;
  }

  setTodayDates() {
    let dates = { dateIni: null, dateEnd: null };
    let dateIni = new Date();
    dates.dateIni = new Date(
      this.datePipe.transform(dateIni, 'yyyy-MM-dd 00:00')).toString();
    dates.dateEnd = new Date(
      this.datePipe.transform(dateIni, 'yyyy-MM-dd 23:59')).toString();
    return dates;
  }

  getTripsByDriver(
    driverId:number, 
    mcId:number, 
    strDateIni:string,
    strDateEnd:string,
    isTodaysRequest: boolean) {
    let path = '/api/reporting/get-trips-by-driver';
    const bodyData = {
      "Driver": Number(driverId),
      "IdMedicalCenter": mcId,
      "dateIni": strDateIni,
      "dateEnd": strDateEnd,
      "isTodaysRequest": isTodaysRequest
    }

    return this.http.post(
      this.baseUrl + path,
      bodyData,
    );
  }

  anyToTrip(data:any) {
    const options:Intl.DateTimeFormatOptions = { month: "2-digit", day: "2-digit", year: "numeric" }
    const obDate = new Date(data.OB).toLocaleString("en-US");
    const rpDate = new Date(data.RP).toLocaleString("en-US");
    const cdDate = new Date(data.CD).toLocaleString("en-US");
    let trip:TripModel = {
      AddressDestination: data.AddressDestination,
      AddressPatient: data.AddressPatient,
      ConsultDestination: data.ConsultDestination,
      PhoneNumber:data.PhoneNumber,
      MobilNumber:data.MobilNumber,
      Date: data.Date,
      Time:data.Time,
      Driver: data.Driver,
      FirstName: data.FirstName,
      LastName: data.LastName,
      IdMC: data.IdMC,
      dist: data.dist,
      distance_range: data.distance_range,
      distkm: data.distkm,
      driver_id: data.driver_id,
      duration: data.duration,
      id: data.id,
      TripType: data.TripType,
      CD: cdDate,
      RP: rpDate,
      OB: obDate,
      patient_id: data.patient_id,
      special_requirement: data.special_requeriment,
      outside_motive_details: data.outside_motive_details,
      comment: data.comment,
      notes: data.notes,
      resourcename1: data.resourcename1,
      resourcename2: data.resourcename2,
      confirmstatus: data.confirmstatus
    }
    if (trip.special_requirement === null) {
      trip.special_requirement = '-';
    }
    return trip;
  }

  formatReportData(
    reportData: { number:TripModel[] },
    medicalCenters:MedicalCenterModel[],
    selectedMedicalCenterId:number,
    drivers:DriverModel[]
  ) {
    const now = new Date();
    const timeOut = {
      date: this.datePipe.transform(now, 'MMM dd, yyyy'),
      time: this.datePipe.transform(now, 'HH:mm a')
    }

    let mc:MedicalCenterModel | null = null;
    mc = medicalCenters.find( (item:any) => 
      item.IdMedicalC === Number(selectedMedicalCenterId) );
    let formated = [];
    for (const key in reportData) {
      let reportDriver:any = {};
      if (Object.prototype.hasOwnProperty.call(reportData, key)) {
        const element = reportData[key];
        if (key) {
          let driver = drivers.find((item:any) => item.Id === Number(key));
          reportDriver.mc = mc;
          reportDriver.driver = driver;
          reportDriver.trips = element;
          reportDriver.timeout = timeOut;
          formated.push(reportDriver);
        }
      }
    }
    return formated;
  }
  
  getCancellations(
    driverId:number,
    mcId:number,
    strDateIni:string,
    strDateEnd:string,
    isTodaysRequest: boolean ) {
    let path = '/api/reporting/get-cancellations';
    const bodyData = {
      "Driver": driverId,
      "IdMedicalCenter": mcId,
      "dateIni": strDateIni,
      "dateEnd": strDateEnd,
      "isTodaysRequest": isTodaysRequest
    }
    return this.http.post(
      this.baseUrl + path,
      bodyData,
    );
  }

  getAllTrips(
    strDateIni:string,
    strDateEnd:string,
    isTodaysRequest: boolean
  ) {
    let path = '/api/reporting/get-all-trips';
    const bodyData = {
      "dateIni": strDateIni,
      "dateEnd": strDateEnd,
      "isTodaysRequest": isTodaysRequest
    }

    return this.http.post(
      this.baseUrl + path,
      bodyData,
    );
  }

  formatAllTrips(
    data:any, 
    medicalCenters:MedicalCenterModel[], 
    drivers:DriverModel[]) {

    const formatted = []
    const mcIds = Object.keys(data);
    mcIds.forEach((strId) => {
      const formattedItem = { 
        medicalCenter: null,
        drivers: []
      }
      const id = Number(strId);

      // medical center
      const medicalCenter = medicalCenters.find( item => item.IdMedicalC === id );
      formattedItem.medicalCenter = medicalCenter;

      const trips = data[id];
      const driverGrouped = trips.reduce((acc, item) => {
        if (!acc[item.driver_id]) {
          acc[item.driver_id] = [];
        }
        acc[item.driver_id].push(item);
        return acc;
      }, {});

      const drIds = Object.keys(driverGrouped);
      drIds.forEach(drId => {
        const driver = drivers.find(item => item.Id === Number(drId));
        const trips = driverGrouped[drId];
        formattedItem.drivers.push({
          driver,
          trips
        });
      });
      formatted.push(formattedItem);
    });

    return formatted;
  }

  getKpi(
    strDateIni:string,
    strDateEnd:string,
    medicalCenterId:number,
    driverId:number,
    isTodaysRequest:boolean
  ) {
    let path = '/api/reporting/get-kpi';
    const bodyData = {
      "dateIni": strDateIni,
      "dateEnd": strDateEnd,
      "medicalCenterId": medicalCenterId,
      "driverId": driverId,
      "isTodaysRequest": isTodaysRequest
    }

    return this.http.post(
      this.baseUrl + path,
      bodyData,
    );
  }

  getAllPatients() {
    const path = '/api/reporting/all-patients';
    return this.http.get(this.baseUrl + path);
  }

  getPatientHistory(formData:any){
    const path = '/api/reporting/patient-history';
    const { strPostDateIni, strPostDateEnd, patientName, patientId } = formData;
    return this.http.post(
      this.baseUrl + path,
      { strPostDateIni, strPostDateEnd, patientName, patientId }
    );
  }

}
