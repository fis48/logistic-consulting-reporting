
export class ReportByDriverTopModel {
  center:string;
  name:string;
  zone:string;
  vehicle:string;
  date:string;
  timeout:string;

  constructor(
    center:string = null,
    name:string = null,
    zone:string = null,
    vehicle:string = null,
    date:string = null,
    timeout:string = null
  ){
    this.center = center;
    this.name = name;
    this.zone = zone;
    this.vehicle = vehicle;
    this.date = date;
    this.timeout = timeout;
  }
}