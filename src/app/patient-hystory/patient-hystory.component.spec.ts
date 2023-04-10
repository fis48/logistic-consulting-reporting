import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientHystoryComponent } from './patient-hystory.component';

describe('PatientHystoryComponent', () => {
  let component: PatientHystoryComponent;
  let fixture: ComponentFixture<PatientHystoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientHystoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientHystoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
