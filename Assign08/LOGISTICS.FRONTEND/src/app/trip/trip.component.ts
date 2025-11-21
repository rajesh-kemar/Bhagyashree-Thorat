import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TripService } from '../services/trip.service';
import { Trip } from '../models/trip.model';
import { Vehicle } from '../models/vehicle.model';
import { Driver } from '../models/driver.model';
import { ActivatedRoute } from '@angular/router'; // for reading filter from query params

@Component({
  selector: 'app-trip',
  standalone: true,
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class TripComponent implements OnInit {
  trips: Trip[] = [];
  filteredTrips: Trip[] = [];
  vehicles: Vehicle[] = [];
  drivers: Driver[] = [];
  tripForm!: FormGroup;
  message = '';
  currentFilter = 'all'; // keep track of current filter
  showCreateForm = false;

  constructor(
    private tripService: TripService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.tripForm = this.fb.group({
      driverId: ['', Validators.required],
      vehicleId: ['', Validators.required],
      source: ['', Validators.required],
      destination: ['', Validators.required],
      startTime: ['', Validators.required],
    });

    // Load trips first, then apply filter based on query param
    this.loadAllData();

    // Listen for query param changes
    this.route.queryParams.subscribe(params => {
      const filter = params['filter'] || 'all';
      this.currentFilter = filter;

      // Delay filter application slightly to ensure trips are loaded
      setTimeout(() => this.filterTrips(filter), 400);
    });
  }

  toggleCreateForm() {   // ✅ add this
    this.showCreateForm = !this.showCreateForm;
  }

  loadAllData() {
    this.loadTrips();
    this.loadAvailableVehicles(); // only available vehicles for dropdown
    this.loadDrivers();
  }

  loadTrips() {
    this.tripService.getTrips().subscribe({
      next: (data) => {
        this.trips = data;
        this.filteredTrips = data;
        // If already navigated with filter, apply it immediately
        if (this.currentFilter) this.filterTrips(this.currentFilter);
      },
      error: (err) => console.error('Error loading trips:', err)
    });
  }

  loadAvailableVehicles() {
    this.tripService.getAvailableVehicles().subscribe({
      next: (data) => (this.vehicles = data),
      error: (err) => console.error('Error loading available vehicles:', err)
    });
  }

  loadDrivers() {
    this.tripService.getDrivers().subscribe({
      next: (data) => {
        this.drivers = data.filter(d =>
          (d.status?.toLowerCase() === 'available')
        );
      },
      error: (err) => console.error('Error loading drivers:', err)
    });
  }

  // Filter function used by dashboard navigation & local buttons
  filterTrips(type: string) {
    this.currentFilter = type;

    switch (type) {
      case 'active':
        this.filteredTrips = this.trips.filter(t => t.status === 'InProgress');
        break;

      case 'completed':
        this.filteredTrips = this.trips.filter(t => t.status === 'Completed');
        break;

      case 'long':
        this.tripService.getLongTrips().subscribe({
          next: (t) => (this.filteredTrips = t),
          error: (err) => console.error('Error loading long trips:', err)
        });
        break;

      default:
        this.filteredTrips = this.trips;
    }
  }

  completeTrip(tripId: number) {
    this.tripService.completeTrip(tripId).subscribe({
      next: () => {
        this.message = 'Trip marked as completed!';
        this.loadAllData();
      },
      error: (err) => console.error('Error completing trip:', err)
    });
  }

  addTrip() {
    if (this.tripForm.invalid) return;

    const form = this.tripForm.value;
    const payload: Partial<Trip> = {
      vehicleId: Number(form.vehicleId),
      driverId: Number(form.driverId),
      source: form.source,
      destination: form.destination,
      startTime: new Date(form.startTime).toISOString(),
      status: 'InProgress'
    };

    this.tripService.addTrip(payload as Trip).subscribe({
      next: () => {
        this.message = 'Trip created successfully!';
        this.tripForm.reset();
        this.loadAllData();
      },
      error: (err) => {
        console.error('Error creating trip:', err);
        this.message = 'Failed to create trip.';
      }
    });
  }

  getDriverName(driverId: number | null | undefined): string {
    if (!driverId) return 'N/A';
    const driver = this.drivers.find(d => d.driverId === driverId);
    return driver ? driver.name : 'N/A';
  }

  getVehicleNumber(trip: any): string {
    return trip?.vehicle?.numberPlate || 'N/A';
  }

  getVehicleType(trip: any): string {
    return trip?.vehicle?.type || 'N/A';
  }



}
