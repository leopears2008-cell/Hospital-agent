const fs = require('fs');
let content = fs.readFileSync('src/components/HospitalList.tsx', 'utf8');

content = content.replace("import { MEDICAL_SPECIALTIES } from '../data/tamilNaduHospitals';", "");

content = content.replace("export function HospitalList({ hospitals, allHospitals, filters, setFilters, onOpenReviews }: HospitalListProps) {",
`export function HospitalList({ hospitals, allHospitals, filters, setFilters, onOpenReviews }: HospitalListProps) {
  const MEDICAL_SPECIALTIES = ['All Specialties', ...Array.from(new Set(allHospitals.map(h => h.specialty)))];
`);

fs.writeFileSync('src/components/HospitalList.tsx', content);
