import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../auth/auth.service/auth.service';

@Component({
  selector: 'app-driver-dashboard',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './driver-dashboard.component.html',
  styleUrls: ['./driver-dashboard.component.css']
})
export class DriverDashboardComponent implements OnInit {

  driverId!: number;
  summary: any = null;
  trips: any[] = [];
  baseUrl = 'http://localhost:5151/api';
  driverInfo: any = null;

  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
  const token = this.authService.getToken();
  if (!token) return;

  const decoded = this.jwtHelper.decodeToken(token);
  console.log("Decoded Token:", decoded);

  const userId =
  decoded["nameid"] ||
  decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
  decoded["sub"];

  console.log("Extracted Correct UserId:", userId);


  console.log("Extracted UserId:", userId);

  if (!userId) {
    console.error("UserId missing in token!");
    return;
  }

  this.getDriverIdFromAPI(userId);
}

getDriverIdFromAPI(userId: string): void {
  this.http.get(`${this.baseUrl}/Drivers/by-user/${userId}`).subscribe({
    next: (driver: any) => {
      this.driverInfo = driver; // ✅ Store full profile
      this.driverId = driver.driverId;
      console.log("Resolved DriverId:", this.driverId);
      this.loadDriverSummary(this.driverId);
    },
    error: (err) => console.error("Driver lookup failed", err)
  });
}



  loadDriverSummary(driverId: number): void {
  this.http.get(`${this.baseUrl}/Trips/drivers/${driverId}/summary`)
    .subscribe({
      next: (data: any) => {
        this.summary = data;
        console.log('Driver Summary:', data);
      },
      error: (err) => console.error('Error loading summary', err)
    });

  this.http.get(`${this.baseUrl}/drivers/${driverId}/trips`)
    .subscribe({
      next: (data: any) => {
        this.trips = data;
        console.log('Driver Trips:', data);
      },
      error: (err) => console.error('Error loading trips', err)
    });
}


  loadTrips(): void {
    this.http.get(`${this.baseUrl}/Drivers/${this.driverId}/trips`)
      .subscribe((data: any) => this.trips = data);
  }

  completeTrip(tripId: number): void {
    this.http.put(`${this.baseUrl}/Trips/${tripId}/complete`, {})
      .subscribe(() => {
        alert('Trip marked as completed ');
        this.loadDriverSummary(this.driverId);
        this.loadTrips();
      });
  }
}
