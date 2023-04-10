
export class PatientModel {
  Id:string;
  MedicalNumber:string;
  Names:string;
  BOD:Date;
  NumberPhone1:string;
  NumberPhone2:string;
  PatientAddress:string;
  Email: string;
  ContactPreferences: string;
  PhysicalLimits: string;
  IdMedicalCenter: number;
  ContactPerson: string;
  PreferredLanguage: string;
  driver: number;
  patient_types: number;
  Notes: string;
  format_requeriment: string;

  constructor(
    Id:string = null,
    MedicalNumber:string = null,
    Names:string = null,
    BOD:Date = null,
    NumberPhone1:string = null,
    NumberPhone2:string = null,
    PatientAddress:string = null,
    Email:string = null,
    ContactPreferences:string = null,
    PhysicalLimits:string = null,
    IdMedicalCenter:number = null,
    ContactPerson:string = null,
    PreferredLanguage:string = null,
    driver:number = null,
    patient_types:number = null,
    Notes: string,
    format_requeriment: string
  ){
    this.Id = Id;
    this.MedicalNumber = MedicalNumber;
    this.Names = Names;
    this.BOD = BOD;
    this.NumberPhone1 = NumberPhone1;
    this.NumberPhone2 = NumberPhone2;
    this.PatientAddress = PatientAddress;
    this.Email = Email;
    this.ContactPreferences = ContactPreferences;
    this.PhysicalLimits = PhysicalLimits;
    this.IdMedicalCenter = IdMedicalCenter;
    this.ContactPerson = ContactPerson;
    this.PreferredLanguage = PreferredLanguage;
    this.driver = driver;
    this.patient_types = patient_types;
    this.Notes = Notes;
    this.format_requeriment = format_requeriment;
  }
}