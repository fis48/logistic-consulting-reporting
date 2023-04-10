
export class DriverModel {
  Driver:string;
  Id:number;
  IdMC:number;
  IdVehicle:number;
  dZone:number;
  east:string;
  north:string;
  south:string;
  user_id:number;
  west:string;

  constructor(
    Driver:string = null,
    Id:number = null,
    IdMC:number = null,
    IdVehicle:number = null,
    dZone:number = null,
    east:string = null,
    north:string = null,
    south:string = null,
    user_id:number = null,
    west:string = null
  ) {
    this.Driver = Driver;
    this.Id = Id;
    this.IdMC = IdMC;
    this.IdVehicle = IdVehicle;
    this.dZone = dZone;
    this.east = east;
    this.north = north;
    this.south = south;
    this.user_id = user_id;
    this.west = west;
  }
}