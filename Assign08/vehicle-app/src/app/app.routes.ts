import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DispatcherDashboardComponent } from './dispatcher-dashboard/dispatcher-dashboard.component';
import { DriverDashboardComponent } from './driver-dashboard/driver-dashboard.component';
import { TripComponent } from './trip/trip.component';
import { DriverComponent } from './driver/driver.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { AuthGuard } from './auth/auth.guard/auth.guard';
import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Login/Register page
  { path: "register", component: RegisterComponent },
  { path: 'dispatcher-dashboard', component: DispatcherDashboardComponent, canActivate: [AuthGuard] },
  { path: 'driver-dashboard', component: DriverDashboardComponent, canActivate: [AuthGuard] },
  { path: 'trips', component: TripComponent, canActivate: [AuthGuard] },
  { path: 'drivers', component: DriverComponent, canActivate: [AuthGuard] },
  { path: 'vehicles', component: VehicleComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];
