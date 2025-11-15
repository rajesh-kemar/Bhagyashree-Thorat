import { Component, OnInit } from '@angular/core';
import { TripService } from '../services/trip.service';
import { Driver } from '../models/driver.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-driver',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css']
})
export class DriverComponent implements OnInit {
  drivers: Driver[] = [];
  filteredDrivers: Driver[] = [];

  constructor(private tripService: TripService) {}

  ngOnInit(): void {
    this.loadDrivers();
  }

  loadDrivers(): void {
  this.tripService.getDrivers().subscribe({
    next: (data) => {
      this.tripService.getTrips().subscribe({
        next: (trips) => {
          const activeDriverIds = trips
            .filter(t => t.status === 'InProgress')
            .map(t => t.driverId);

          this.drivers = data.map(d => ({
            ...d,
            status: activeDriverIds.includes(d.driverId) ? 'Busy' : 'Available',
          }));

          this.filteredDrivers = [...this.drivers];
        },
        error: (err) => console.error('Error loading trips', err)
      });
    },
    error: (err) => console.error('Error loading drivers', err)
  });
}



filterDrivers(type: string): void {
  if (type === 'all') {
    this.filteredDrivers = this.drivers;
  } else if (type === 'available') {
    this.filteredDrivers = this.drivers.filter(d => d.status === 'Available');
  }
}

  showAll() {
    this.filteredDrivers = this.drivers;
  }

  showAvailable() {
    this.filteredDrivers = this.drivers.filter(d => d.status === 'Available');
  }
}
