export interface Vehicle {
  vehicleId: number;
  numberPlate: string;
  type: string;
  capacity: number;
  status: string; // Available / In Use / Maintenance
  completedTrips?: number;
}
