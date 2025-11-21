import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service/auth.service';
import { CommonModule } from '@angular/common';  
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-dispatcher-dashboard',
  standalone: true,
  imports: [CommonModule,RouterModule],  
  templateUrl: './dispatcher-dashboard.component.html',
  styleUrls: ['./dispatcher-dashboard.component.css']
})
export class DispatcherDashboardComponent implements OnInit {
  totalTrips = 0;
  activeTrips = 0;
  completedTrips = 0;
  vehiclesAvailable = 0;
  busyDrivers = 0;
  busyVehicles = 0;


  inviteCode: string | null = null;

  constructor(
  private http: HttpClient,
  private auth: AuthService
) {}

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
  // Trips overview
  this.http.get<any[]>('http://localhost:5151/api/Trips').subscribe({
    next: (trips) => {
      this.totalTrips = trips.length;
      this.activeTrips = trips.filter(t => t.status === 'InProgress').length;
      this.completedTrips = trips.filter(t => t.status === 'Completed').length;
    }
  });

  // Available Vehicles
  this.http.get<any[]>('http://localhost:5151/api/Vehicles/available').subscribe({
    next: (vehicles) => {
      this.vehiclesAvailable = vehicles.length;
    }
  });

  // Busy Drivers
  this.http.get<any[]>('http://localhost:5151/api/Drivers/busy').subscribe({
    next: (drivers) => {
      this.busyDrivers = drivers.length;
    }
  });

  // Busy Vehicles
  this.http.get<any[]>('http://localhost:5151/api/Vehicles/busy').subscribe({
    next: (vehicles) => {
      this.busyVehicles = vehicles.length;
    }
  });
}

  generateInvite() {
  this.auth.generateInvite().subscribe({
    next: (res: any) => {
      this.inviteCode = res.code || res.inviteCode;
      alert(" Invite Generated Successfully!");
    },
    error: () => alert(" Failed to generate invite.")
  });
  }

  copyInvite() {
  navigator.clipboard.writeText(this.inviteCode!);
  alert("📋 Invite Code Copied to Clipboard!");
  }

}
