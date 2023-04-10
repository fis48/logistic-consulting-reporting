import { DriverModel } from './driverModel';

export interface IReportAllTripsTop {
  title: string;
  total_trips: number;
  completed: { total: string; percentage: string };
  cancelled: { total: string; percentage: string };
  timeout: Date,
  dates?: { dateIni?:Date; dateEnd?: Date; };
}

export interface IReportAllTripsItem {
  center_name: string;
  // drivers: { driver_name:string; total:number }[];
  drivers: any[];
  scheduled: number
  completed: { percentage: string; total: string };
  cancelled: { percentage: string; total: string };
}