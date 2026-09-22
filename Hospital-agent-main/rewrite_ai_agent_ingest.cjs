const fs = require('fs');

let content = fs.readFileSync('src/lib/ai-agent.ts', 'utf8');

// Remove static imports
content = content.replace('import { TAMIL_NADU_HOSPITALS } from "../data/tamilNaduHospitals.ts";', 'import { db } from "../db/index.ts";\nimport { hospitals, doctors } from "../db/schema.ts";');
content = content.replace('import { MOCK_DOCTORS } from "../data/doctors.ts";', '');

// Replace ingestData
const newIngest = `
  public async ingestData() {
    console.log("Ingesting and chunking hospital/doctor data...");
    try {
      const allHospitals = await db.select().from(hospitals).all();
      const allDoctors = await db.select().from(doctors).all();

      // Chunking Hospitals
      for (const hospital of allHospitals) {
        const content = \`Hospital Name: \${hospital.name}. Location: \${hospital.cityOrDistrict}. Address: \${hospital.address}. Specialties: \${hospital.specialty}. Rating: \${hospital.rating}/5. Emergency: \${hospital.emergencyAvailable ? 'Yes' : 'No'}.\`;
        this.chunks.push({
          id: \`hosp_\${hospital.id}\`,
          documentType: "hospital_profile",
          content,
          metadata: { hospitalId: hospital.id, district: hospital.cityOrDistrict, type: "hospital" }
        });
      }

      // Chunking Doctors
      for (const doctor of allDoctors) {
        const content = \`Doctor Name: \${doctor.name}. Specialization: \${doctor.specialization} (\${doctor.department}). Experience: \${doctor.experienceYears} years. Consultation Fee: ₹\${doctor.consultationFee}. Hospital: \${doctor.hospitalId}.\`;
        this.chunks.push({
          id: \`doc_\${doctor.id}\`,
          documentType: "doctor_profile",
          content,
          metadata: { doctorId: doctor.id, hospitalId: doctor.hospitalId, specialization: doctor.specialization, type: "doctor" }
        });
      }
    } catch(e) { console.error("Ingest error", e); }
`;
content = content.replace(/public async ingestData\(\) \{[\s\S]*?(?=\/\/ Phase 5)/, newIngest);

fs.writeFileSync('src/lib/ai-agent.ts', content);
