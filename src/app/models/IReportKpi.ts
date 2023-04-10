
export interface IReportKpiTop {
  title:string;
  medical_center: string;
  total_trips: number;
  completed: { total:string, percentage: string };
  timeout: Date;
  dates: { dateIni: Date, dateEnd: Date }
  onTime: {
    late: { total:string, percentage:string },
    on_time: { total:string, percentage:string }
  }
}

export interface IReportKpiItem {
  trip_type: string,
  patient_name: string;
  appointment_date: string;
  ob: string;
  dp: string;
  driver: string;
  on_time: string;
}