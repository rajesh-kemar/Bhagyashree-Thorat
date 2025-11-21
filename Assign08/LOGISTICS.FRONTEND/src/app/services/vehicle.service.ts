import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle } from '../models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private baseUrl = 'http://localhost:5151/api/Vehicles';

  constructor(private http: HttpClient) {}

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.baseUrl);
  }

  addVehicle(vehicle: Vehicle): Observable<any> {
    return this.http.post(this.baseUrl, vehicle);
  }

  deleteVehicle(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  markActive(id: number) {
  return this.http.put(`${this.baseUrl}/${id}/active`, {});
}

markInactive(id: number) {
  return this.http.put(`${this.baseUrl}/${id}/inactive`, {});
}


}
