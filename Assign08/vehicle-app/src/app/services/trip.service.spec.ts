import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private baseUrl = 'https://localhost:7150/api'; // your .NET API base URL

  constructor(private http: HttpClient) {}

  // Get all trips
  getTrips(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/trips`);
  }

  // Create new trip
  addTrip(trip: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/trips`, trip);
  }

  // Mark trip completed
  completeTrip(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/trips/${id}/complete`, {});
  }

  // Get available vehicles
  getAvailableVehicles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/vehicles/available`);
  }
}
