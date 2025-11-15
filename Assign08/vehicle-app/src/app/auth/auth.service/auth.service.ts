import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private baseUrl = 'http://localhost:5151/api'; // API Base URL

  constructor(private http: HttpClient, private router: Router) {}

  // =============================== AUTH CALLS ===============================

  login(credentials: any) {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials);
  }

  register(data: any) {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  // =============================== TOKEN HANDLING ===========================

  saveToken(token: string, role: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/']); // back to login page
  }
  
  generateInvite(daysValid: number = 1) {
    return this.http.post<any>(
     `${this.baseUrl}/Admin/dispatcher-invites?daysValid=${daysValid}`,
     {}
   );
  }

}
