const fs = require('fs');

let content = fs.readFileSync('src/lib/ai-agent.ts', 'utf8');

// Remove static imports
content = content.replace('import { TAMIL_NADU_HOSPITALS } from "../data/tamilNaduHospitals.ts";', 'import { db } from "../db/index.ts";\nimport { hospitals, doctors } from "../db/schema.ts";');
content = content.replace('import { MOCK_DOCTORS } from "../data/doctors.ts";', '');

// find retrieveKnowledgeBase function and replace its usage
content = content.replace(
`  private async retrieveKnowledgeBase(query: string): Promise<string> {
    // Basic keyword matching for RAG
    const keywords = query.toLowerCase().split(' ').filter(w => w.length > 3);
    
    let relevantInfo = '';
    
    // Search hospitals
    for (const hospital of TAMIL_NADU_HOSPITALS) {
      const match = keywords.some(k => 
        hospital.name.toLowerCase().includes(k) || 
        hospital.specialty.toLowerCase().includes(k)
      );
      if (match) {
        relevantInfo += \`Hospital: \${hospital.name}, Specialty: \${hospital.specialty}, Location: \${hospital.cityOrDistrict}. \`;
      }
    }
    
    // Search doctors
    for (const doctor of MOCK_DOCTORS) {
      const match = keywords.some(k => 
        doctor.name.toLowerCase().includes(k) || 
        doctor.specialization.toLowerCase().includes(k) ||
        doctor.department.toLowerCase().includes(k)
      );
      if (match) {
        relevantInfo += \`Doctor: \${doctor.name}, Specialization: \${doctor.specialization}, Experience: \${doctor.experienceYears} years. \`;
      }
    }
    
    return relevantInfo || "No specific information found in the local database.";
  }`,
`  private async retrieveKnowledgeBase(query: string): Promise<string> {
    // Basic keyword matching for RAG
    const keywords = query.toLowerCase().split(' ').filter(w => w.length > 3);
    
    let relevantInfo = '';
    
    try {
      const allHospitals = await db.select().from(hospitals).all();
      // Search hospitals
      for (const hospital of allHospitals) {
        const match = keywords.some(k => 
          hospital.name.toLowerCase().includes(k) || 
          hospital.specialty.toLowerCase().includes(k)
        );
        if (match) {
          relevantInfo += \`Hospital: \${hospital.name}, Specialty: \${hospital.specialty}, Location: \${hospital.cityOrDistrict}. \`;
        }
      }
      
      const allDoctors = await db.select().from(doctors).all();
      // Search doctors
      for (const doctor of allDoctors) {
        const match = keywords.some(k => 
          doctor.name.toLowerCase().includes(k) || 
          doctor.specialization.toLowerCase().includes(k) ||
          doctor.department.toLowerCase().includes(k)
        );
        if (match) {
          relevantInfo += \`Doctor: \${doctor.name}, Specialization: \${doctor.specialization}, Experience: \${doctor.experienceYears} years. \`;
        }
      }
    } catch (e) {
      console.error("RAG retrieval error", e);
    }
    
    return relevantInfo || "No specific information found in the local database.";
  }`
);

fs.writeFileSync('src/lib/ai-agent.ts', content);
