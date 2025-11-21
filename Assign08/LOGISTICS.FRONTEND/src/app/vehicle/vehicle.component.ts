import { Component, OnInit } from '@angular/core';
import { TripService } from '../services/trip.service';
import { Vehicle } from '../models/vehicle.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { VehicleService } from '../services/vehicle.service'; // ✅ Replace TripService


@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ Added FormsModule
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {

  vehicles: Vehicle[] = [];
  filteredVehicles: Vehicle[] = [];
  currentFilter: string = 'all'; 
  showAddForm = false;

  // ✅ Add form model
  newVehicle = {
    numberPlate: '',
    type: '',
    capacity: null
  };

  constructor(
    private tripService: TripService,
    private vehicleService: VehicleService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadVehicles();

    this.route.queryParams.subscribe(params => {
      const filter = params['filter'] || 'all';
      this.currentFilter = filter;
      setTimeout(() => this.filterVehicles(filter), 300);
    });
  }


  toggleAddForm() {    // ✅ add this
    this.showAddForm = !this.showAddForm;
  }

  // ✅ Load vehicles directly (status already comes from backend)
  loadVehicles(): void {
    this.tripService.getVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
        this.filteredVehicles = [...this.vehicles];
      },
      error: (err) => console.error('Error loading vehicles', err)
    });
  }

  // ✅ Add Vehicle
  addVehicle(): void {
    const vehicleData = {
      numberPlate: this.newVehicle.numberPlate,
      type: this.newVehicle.type,
      capacity: this.newVehicle.capacity,
      status: 'Available' // Backend also enforces this, but no harm
    };

    this.tripService.addVehicle(vehicleData).subscribe({
      next: () => {
        alert("✅ Vehicle Added Successfully!");
        this.newVehicle = { numberPlate: '', type: '', capacity: null }; // reset form
        this.loadVehicles(); // refresh
      },
      error: () => alert("❌ Failed to add vehicle")
    });
  }

  filterVehicles(type: string): void {
  this.currentFilter = type;

  if (type === 'all') {
    this.filteredVehicles = this.vehicles; // show all including inactive
  } 
  else if (type === 'available') {
    this.filteredVehicles = this.vehicles.filter(v => v.status === 'Available');
  } 
  else if (type === 'busy') {
    this.filteredVehicles = this.vehicles.filter(v => v.status === 'Busy');
  }
  else if (type === 'inactive') {
    this.filteredVehicles = this.vehicles.filter(v => v.status === 'Inactive');
  }
}

  markInactive(vehicleId: number): void {
  if (confirm("Mark this vehicle as Inactive?")) {
   this.vehicleService.markInactive(vehicleId).subscribe({
      next: () => {
        alert("Vehicle marked as Inactive!");
        this.loadVehicles();
      },
      error: () => alert("Failed to update vehicle status.")
    });
  }
  }

  markActive(vehicleId: number): void {
  if (confirm("Make this vehicle Active again?")) {
    this.vehicleService.markActive(vehicleId).subscribe({
      next: () => {
        alert("Vehicle marked as Active (Available)!");
        this.loadVehicles();
      },
      error: () => alert("Failed to update vehicle status.")
    });
  }
}


}