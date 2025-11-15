import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TripComponent } from './trip/trip.component';
import { DriverComponent } from './driver/driver.component';
import { VehicleComponent } from './vehicle/vehicle.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'trips', component: TripComponent },
  { path: 'drivers', component: DriverComponent },
  { path: 'vehicles', component: VehicleComponent },
  { path: '**', redirectTo: '' }
];
