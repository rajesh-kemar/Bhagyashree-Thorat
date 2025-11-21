import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatcherDashboardComponent } from './dispatcher-dashboard.component';

describe('DispatcherDashboard', () => {
  let component: DispatcherDashboardComponent;
  let fixture: ComponentFixture<DispatcherDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DispatcherDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispatcherDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
