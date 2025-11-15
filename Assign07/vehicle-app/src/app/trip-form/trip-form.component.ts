

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trip-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './trip-form.component.html',
  styleUrls: ['./trip-form.component.css']
})
export class TripFormComponent implements OnInit {
  tripForm!: FormGroup;
  vehicles: any[] = [];
  drivers: any[] = [];
  message = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    // Initialize the form fields
    this.tripForm = this.fb.group({
      vehicleId: ['', Validators.required],
      driverId: ['', Validators.required],
      source: ['', Validators.required],
      destination: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: [''],
      status: ['InProgress']
    });

    // Load available vehicles
    this.http.get<any[]>('https://localhost:5151/api/vehicles/available')
      .subscribe({
        next: data => this.vehicles = data,
        error: err => console.error('Error loading vehicles', err)
      });

    // Load drivers (if endpoint exists)
    this.http.get<any[]>('https://localhost:5151/api/drivers')
      .subscribe({
        next: data => this.drivers = data,
        error: err => console.error('Error loading drivers', err)
      });
  }
 
  onSubmit(): void {
    if (this.tripForm.valid) {
      const newTrip = this.tripForm.value;
      this.http.post('https://localhost:5151/api/trips', newTrip)
        .subscribe({
          next: () => {
            this.message = 'Trip created successfully!';
            this.tripForm.reset({ status: 'InProgress' });
          },
          error: err => {
            console.error('Error creating trip', err);
            this.message = 'Failed to create trip.';
          }
        });
    } else {
      this.message = 'Please fill all required fields.';
    }
  }
}


