import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripsByDriverComponent } from './trips-by-driver.component';

describe('TripsByDriverComponent', () => {
  let component: TripsByDriverComponent;
  let fixture: ComponentFixture<TripsByDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripsByDriverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripsByDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
