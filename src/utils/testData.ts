export interface SearchScenario {
  destination: string;
  adults: number;
  rooms: number;
  minStars?: number;
}

export const destinations: SearchScenario[] = [
  { destination: 'Paris', adults: 2, rooms: 1 },
  { destination: 'New York', adults: 2, rooms: 1, minStars: 4 },
  { destination: 'Tokyo', adults: 1, rooms: 1 },
  { destination: 'Rome', adults: 4, rooms: 2 },
];

/** Returns a check-in/check-out pair N days from now, M nights long. */
export function futureDateRange(daysFromNow: number, nights: number) {
  const checkIn = new Date();
  checkIn.setDate(checkIn.getDate() + daysFromNow);
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkOut.getDate() + nights);

  const fmt = (d: Date) => d.toISOString().split('T')[0]; // YYYY-MM-DD
  return { checkIn: fmt(checkIn), checkOut: fmt(checkOut) };
}
