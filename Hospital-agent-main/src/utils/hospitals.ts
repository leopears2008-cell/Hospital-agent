import { Hospital } from '../types';

export function getUniqueDistricts(hospitals: Hospital[]): string[] {
  const districts = new Set(hospitals.map(h => h.cityOrDistrict));
  const sortedDistricts = Array.from(districts).sort((a, b) => a.localeCompare(b));
  return ['All Tamil Nadu', ...sortedDistricts];
}
