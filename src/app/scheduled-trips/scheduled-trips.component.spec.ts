import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledTripsComponent } from './scheduled-trips.component';

describe('ScheduledTripsComponent', () => {
  let component: ScheduledTripsComponent;
  let fixture: ComponentFixture<ScheduledTripsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduledTripsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
