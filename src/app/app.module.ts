import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { GoogleChartsModule } from 'angular-google-charts';

import { HomeComponent } from './home/home.component';
import { TopComponent } from './top/top.component';
import { ScheduledTripsComponent } from './scheduled-trips/scheduled-trips.component';
import { AllTripsComponent } from './all-trips/all-trips.component';
import { TripsByDriverComponent } from './trips-by-driver/trips-by-driver.component';
import { LoginComponent } from './login/login.component';
import { CancellationsComponent } from './cancellations/cancellations.component';
import { ReportFormComponent } from './report-form/report-form.component';
import { KpiComponent } from './kpi/kpi.component';
import { MonitoringComponent } from './monitoring/monitoring.component';
import { PatientHystoryComponent } from './patient-hystory/patient-hystory.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TopComponent,
    ScheduledTripsComponent,
    AllTripsComponent,
    TripsByDriverComponent,
    LoginComponent,
    CancellationsComponent,
    ReportFormComponent,
    KpiComponent,
    MonitoringComponent,
    PatientHystoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    GoogleChartsModule
    
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
