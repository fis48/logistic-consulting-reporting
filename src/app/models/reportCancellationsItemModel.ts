
export class ReportCancellationsItemModel {
  trip_id:string;
  trip_time:string;
  pickup_location:string;
  wheel_chair:string;
  walker:string;
  subject:string;
  destination:string;
  home_phone:string;
  cel_phone:string;
  driver:string;
  
  constructor(
    trip_id:string = null,
    trip_time:string = null,
    pickup_location:string = null,
    wheel_chair:string = null,
    walker:string = null,
    subject:string = null,
    destination:string = null,
    home_phone:string = null,
    cel_phone:string = null,
    driver:string = null,
  ){
    this.trip_id = trip_id;
    this.trip_time = trip_time;
    this.pickup_location = pickup_location;
    this.wheel_chair = wheel_chair;
    this.walker = walker;
    this.subject = subject;
    this.destination = destination;
    this.home_phone = home_phone;
    this.trip_id = trip_id;
    this.cel_phone = cel_phone;
    this.driver = driver;
  }

}