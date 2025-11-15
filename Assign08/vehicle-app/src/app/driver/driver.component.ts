import { Component, OnInit } from '@angular/core';
import { DriverService } from '../services/driver.service';
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
  currentFilter: string = 'all';

  constructor(private driverService: DriverService, private tripService: TripService) {}

  ngOnInit(): void {
    this.loadDrivers();
  }

  loadDrivers(): void {
    this.driverService.getDrivers().subscribe({
      next: (data) => {
        this.tripService.getTrips().subscribe({
          next: (trips) => {
            const activeDriverIds = trips
              .filter(t => t.status === 'InProgress')
              .map(t => t.driverId);

            this.drivers = data.map(d => ({
              ...d,
              status: d.status === "Inactive"
                ? "Inactive"
                : activeDriverIds.includes(d.driverId) 
                  ? "Busy" 
                  : "Available"
            }));

            this.filteredDrivers = [...this.drivers];
          }
        });
      }
    });
  }

  filterDrivers(type: string) {
    this.currentFilter = type;

    if (type === 'all') this.filteredDrivers = this.drivers;
    else this.filteredDrivers = this.drivers.filter(d => d.status === type.charAt(0).toUpperCase() + type.slice(1));
  }

  markInactive(id: number): void {
    this.driverService.markInactive(id).subscribe(() => this.loadDrivers());
  }

  markActive(id: number): void {
    this.driverService.markActive(id).subscribe(() => this.loadDrivers());
  }
}
