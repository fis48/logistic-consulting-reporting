import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginModel } from '../models/loginModel';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  public loginModel:LoginModel = new LoginModel();

  constructor(
    private mainService:MainService,
    private router:Router
  ) { }

  ngOnInit(): void {


    // this.mainService.login().subscribe(
    //   (result:any) => {



    //     // this.loginData = result.data;
    //     // // medical centers
    //     // this.getMedicalCenters(this.loginData);
    //     // // drivers
    //     // this.getDrivers(this.loginData);
    //   },
    //   (e) => {
    //     console.log('Error api login: ' + e);
    //   }
    // );
    
  }

  handleLogin() {
    this.mainService.login(this.loginModel.email, this.loginModel.pass).subscribe(
      (result:any) => {
        if (result.token) {
          localStorage.setItem('api_token', result.token);
          this.router.navigate(['/home']);
        }
      },
      (e) => { 
        console.log(e.message);
        alert('Not authorized data. Please try again.');
      }
    );
  }

}
