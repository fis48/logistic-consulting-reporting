
export class ReportByDriverItemModel {
  trip_id:string;
  pickup_time:string;
  patient_name:string;
  patient_phones:string;
  pickup_location:string;
  special_requirement:string;
  // wheel_chair:boolean;
  // walker:boolean;
  destination:string;
  reason:string;
  subject:string;
  comments:string;
  resourcename1:string;

  constructor(
    trip_id:string = null,
    pickup_time:string = null,
    patient_name:string = null,
    patient_phones:string = null,
    pickup_location:string = null,
    special_requirement: string = null,
    // wheel_chair:boolean = null,
    // walker:boolean = null,
    destination:string = null,
    reason:string = null,
    subject:string = null,
    comments:string = null,
    resourcename1:string = null
  ) {
    this.trip_id = trip_id;
    this.pickup_time = pickup_time;
    this.patient_name = patient_name;
    this.patient_phones = patient_phones;
    this.pickup_location = pickup_location;
    this.special_requirement = special_requirement;
    // this.wheel_chair = wheel_chair;
    // this.walker = walker;
    this.destination = destination;
    this.reason = reason;
    this.trip_id = trip_id;
    this.comments = comments;
    this.resourcename1 = resourcename1;
  }
}