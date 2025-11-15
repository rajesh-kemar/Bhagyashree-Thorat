import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/auth.service/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Logistics Management';

  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
  }

  goToDashboard() {
    const role = this.authService.getRole();
    if (role === 'Dispatcher') this.router.navigate(['/dispatcher-dashboard']);
    else if (role === 'Driver') this.router.navigate(['/driver-dashboard']);
  }
}
