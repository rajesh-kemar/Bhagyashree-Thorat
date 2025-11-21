export interface Trip {
  tripId: number;
  vehicleId: number;
  driverId: number;
  source: string;
  destination: string;
  startTime: string;
  endTime?: string;
  status: string;
  vehicle?: any;
  driver?: any;
}
