import { Component, OnInit } from '@angular/core';
import { TripService } from '../services/trip.service';
import { Vehicle } from '../models/vehicle.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {
  vehicles: Vehicle[] = [];
  filteredVehicles: Vehicle[] = [];

  constructor(private tripService: TripService) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
  this.tripService.getVehicles().subscribe({
    next: (data) => {
      this.tripService.getTrips().subscribe({
        next: (trips) => {
          const activeVehicleIds = trips
            .filter(t => t.status === 'InProgress')
            .map(t => t.vehicleId);

          this.vehicles = data.map(v => ({
            ...v,
            status: activeVehicleIds.includes(v.vehicleId) ? 'Busy' : 'Available',
          }));

          this.filteredVehicles = [...this.vehicles];
        },
        error: (err) => console.error('Error loading trips', err)
      });
    },
    error: (err) => console.error('Error loading vehicles', err)
  });
}


filterVehicles(type: string): void {
  if (type === 'all') {
    this.filteredVehicles = this.vehicles;
  } else if (type === 'available') {
    this.filteredVehicles = this.vehicles.filter(v => v.status === 'Available');
  }
}

  filterVehicle: Vehicle[] = [];


  showAll() {
    this.filteredVehicles = this.vehicles;
  }

  showAvailable() {
    this.filteredVehicles = this.vehicles.filter(v => v.status === 'Available');
  }
}
