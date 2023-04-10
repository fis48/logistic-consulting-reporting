
export class LoginModel {
  email:string;
  pass:string;

  constructor(
    email:string = null,
    pass:string = null
  ){
    this.email = email;
    this.pass = pass;
  }
}