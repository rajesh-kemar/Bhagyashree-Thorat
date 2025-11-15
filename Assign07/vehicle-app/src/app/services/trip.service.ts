// src/app/services/trip.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Trip } from '../models/trip.model';
import { Driver } from '../models/driver.model';
import { Vehicle } from '../models/vehicle.model';


@Injectable({ providedIn: 'root' })
export class TripService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.apiUrl}/trips`);
  }

  getAvailableVehicles(): Observable<Vehicle[]> {
  return this.http.get<Vehicle[]>(`${this.apiUrl}/vehicles/available`);
}

  //getDrivers(): Observable<Driver[]> {
  //  return this.http.get<Driver[]>(`${this.apiUrl}/drivers`);
  //}
  getDrivers(): Observable<Driver[]> {
  return this.http.get<Driver[]>(`${this.apiUrl}/drivers`);
}


  addTrip(trip: Trip): Observable<Trip> {
    return this.http.post<Trip>(`${this.apiUrl}/trips`, trip);
  }

  completeTrip(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/trips/${id}/complete`, {});
  }

  getLongTrips(): Observable<Trip[]> {
  return this.http.get<Trip[]>(`${this.apiUrl}/trips/long`);
  }

  getVehicles() {
  return this.http.get<Vehicle[]>(`${this.apiUrl}/vehicles`);
  }


}
