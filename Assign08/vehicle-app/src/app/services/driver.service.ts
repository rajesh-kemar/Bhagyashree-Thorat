import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Driver } from '../models/driver.model';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  private baseUrl = 'http://localhost:5151/api/Drivers';

  constructor(private http: HttpClient) {}

  getDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(this.baseUrl);
  }

  markInactive(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/inactive`, {});
  }

  markActive(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/active`, {});
  }
}
