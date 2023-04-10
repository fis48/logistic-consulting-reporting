import { TripModel } from './tripModel';

export interface IMonitoringTop {
  title:string;
  medical_center:string;
  date: Date;
  total_trips:number;
  timeout:Date
}

export interface IMonitoringColumn {
  title: string;
  total: number;
  percentage: string;
  trips: TripModel[];
}

export interface IMonitoringResult {
  pending: IMonitoringColumn;
  onBoard: IMonitoringColumn;
  completed: IMonitoringColumn;
  canceled: IMonitoringColumn;
}