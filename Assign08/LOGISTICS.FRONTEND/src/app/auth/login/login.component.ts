import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  message = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    const credentials = {
      username: this.username,
      password: this.password
    };

    this.authService.login(credentials).subscribe({
      next: (res: any) => {
        console.log('Login Response:', res);
        if (res && res.token) {
          this.authService.saveToken(res.token, res.role);
          this.message = 'Login successful!';

          // ✅ Redirect based on role
          if (res.role === 'Dispatcher') {
            this.router.navigate(['/dispatcher-dashboard']);
          } else if (res.role === 'Driver') {
            this.router.navigate(['/driver-dashboard']);
          }
        } else {
          this.message = 'Unexpected response from server';
        }
      },
      error: (err) => {
        console.error('Login Error:', err);
        this.message = 'Invalid credentials';
      }
    });
  }
}
