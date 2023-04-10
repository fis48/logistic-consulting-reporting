
export interface ITopPatient {
  title: string;
  totalTrips: number;
  dates: { dateIni: Date, dateEnd:Date };
  timeout: Date;
}