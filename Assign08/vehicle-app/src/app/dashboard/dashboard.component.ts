// import { Component, OnInit } from '@angular/core';
// import { TripService } from '../services/trip.service';
// import { Trip } from '../models/trip.model';
// import { Router } from '@angular/router'; // added

// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.css']
// })
// export class DashboardComponent implements OnInit {
//   totalTrips = 0;
//   activeTrips = 0;
//   completedTrips = 0;
//   longTrips = 0;
//   availableVehicles = 0;

//   constructor(private tripService: TripService, private router: Router) {} // added Router

//   ngOnInit(): void {
//     this.loadDashboard();
//   }

//   loadDashboard(): void {
//     this.tripService.getTrips().subscribe(trips => {
//       this.totalTrips = trips.length;
//       this.activeTrips = trips.filter(t => t.status === 'InProgress').length;
//       this.completedTrips = trips.filter(t => t.status === 'Completed').length;
//     });

//     this.tripService.getLongTrips().subscribe((trips: Trip[]) => {
//       this.longTrips = trips.length;
//     });

//     this.tripService.getAvailableVehicles().subscribe(vehicles => {
//       this.availableVehicles = vehicles.length;
//     });
//   }

//   // New function for navigation
//   goToTrips(filter: string): void {
//     this.router.navigate(['/trips'], { queryParams: { filter } });
//   }

//   // navigate to vehicles page with filter
//   goToVehicles(filter: string): void {
//     this.router.navigate(['/vehicles'], { queryParams: { filter } });
//   }

// }
