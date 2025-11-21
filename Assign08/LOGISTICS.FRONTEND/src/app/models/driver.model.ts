export interface Driver {
  driverId: number;
  name: string;
  licenseNumber: string;
  phone: string;
  experienceYears: number;
  status: string; // Available / Busy / Inactive
  completedTrips?: number;
}
