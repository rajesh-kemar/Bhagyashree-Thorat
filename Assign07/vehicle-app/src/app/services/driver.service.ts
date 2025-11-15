import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Driver {
  driverId: number;
  name: string;
  licenseNumber: string;
  phone: string;
  experienceYears: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private apiUrl = 'http://localhost:5151/api/drivers';

  constructor(private http: HttpClient) {}

  getAvailableDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(`${this.apiUrl}/available`);
  }

  getAllDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(this.apiUrl);
  }
}
