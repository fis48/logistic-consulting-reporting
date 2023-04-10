
export class MedicalCenterModel {
  id: string;
  AddressMedicalC:string;
  IdMedicalC:number;
  Name:string;
  Specialty:string;

  constructor(
    AddressMedicalC:string = null,
    IdMedicalC:number = null,
    Name:string = null,
    Specialty:string = null
  ) {
    this.AddressMedicalC = AddressMedicalC;
    this.IdMedicalC = IdMedicalC;
    this.Name = Name;
    this.Specialty = Specialty;
  }
}