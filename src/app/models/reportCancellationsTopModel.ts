
export class ReportCancellationsTopModel {
  medical_center:string;
  date:string;
  time:string;

  constructor(
    medical_center:string = null,
    date:string = null,
    time:string = null
  ){
    this.medical_center = medical_center;
    this.date = date;
    this.time = time;
  }
}