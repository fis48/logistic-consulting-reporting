
export class TripModel {
  AddressDestination:string;
  AddressPatient:string;
  ConsultDestination:string;
  PhoneNumber:string;
  MobilNumber:string;
  Date:string;
  Time:string;
  Driver:string;
  FirstName:string;
  LastName:string;
  IdMC:number;
  dist:string;
  distance_range:string;
  distkm:number;
  driver_id:number;
  duration:string;
  id:number;
  TripType: string;
  CD:string;
  RP:string;
  OB:string;
  patient_id:number
  special_requirement:string;
  outside_motive_details:string;
  comment:string;
  notes:string;
  resourcename1:string;
  resourcename2:string;
  confirmstatus:string;
  
  constructor(
    AddressDestination:string = null,
    AddressPatient:string = null,
    ConsultDestination:string = null,
    PhoneNumber:string = null,
    MobilNumber:string = null,
    Date:string = null,
    Time:string = null,
    Driver:string = null,
    FirstName:string = null,
    LastName:string = null,
    IdMC:number = null,
    dist:string = null,
    distance_range:string = null,
    distkm:number = null,
    driver_id:number = null,
    duration:string = null,
    id:number = null,
    TripType = null,
    CD:string = null,
    patient_id:number = null,
    special_requirement = null,
    outside_motive_details = null,
    comment = null,
    notes = null,
    resourcename1: null,
    resourcename2: null,
    confirmstatus: null,
  ){
    this.AddressDestination = AddressDestination;
    this.AddressPatient = AddressPatient;
    this.ConsultDestination = ConsultDestination;
    this.PhoneNumber = PhoneNumber;
    this.MobilNumber = MobilNumber;
    this.Date = Date;
    this.Time = Time;
    this.Driver = Driver;
    this.FirstName = FirstName;
    this.LastName = LastName;
    this.IdMC = IdMC;
    this.dist = dist;
    this.distance_range = distance_range;
    this.distkm = distkm;
    this.driver_id = driver_id;
    this.duration = duration;
    this.id = id;
    this.TripType = TripType;
    this.CD = CD;
    this.patient_id = patient_id;
    this.special_requirement = special_requirement;
    this.outside_motive_details = outside_motive_details;
    this.comment = comment;
    this.resourcename1 = resourcename1;
    this.resourcename2 = resourcename2;
    this.confirmstatus = confirmstatus;
    this.notes = notes;
  }

}