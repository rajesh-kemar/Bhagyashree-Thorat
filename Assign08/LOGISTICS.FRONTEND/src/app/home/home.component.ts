import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  username = '';
  password = '';
  message = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    const data = { username: this.username, password: this.password };
    this.authService.login(data).subscribe({
      next: (res:any) => {
        this.authService.saveToken(res.token, res.role);
        this.message = 'Login successful!';

        if (res.role === 'Dispatcher') {
          this.router.navigate(['/dispatcher-dashboard']);
        } else if (res.role === 'Driver') {
          this.router.navigate(['/driver-dashboard']);
        }
      },
      error: () => this.message = 'Invalid credentials'
    });
  }
}
