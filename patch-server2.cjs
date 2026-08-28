const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const ret = `
function retrieveKnowledgeBase(query: string) {
  const normalizedQuery = query.toLowerCase();
  const keywords = normalizedQuery.split(/\\s+/).filter(k => k.length > 2);
  
  let matchedHospitals = TAMIL_NADU_HOSPITALS.filter(h => {
    const searchString = \`\${h.name} \${h.cityOrDistrict} \${h.specialty} \${h.address}\`.toLowerCase();
    return keywords.some(k => searchString.includes(k));
  });

  if (matchedHospitals.length === 0) matchedHospitals = TAMIL_NADU_HOSPITALS.slice(0, 15);
  else if (matchedHospitals.length > 15) matchedHospitals = matchedHospitals.slice(0, 15);

  let matchedDoctors = MOCK_DOCTORS.filter(d => {
    const searchString = \`\${d.name} \${d.department} \${d.specialization}\`.toLowerCase();
    return keywords.some(k => searchString.includes(k));
  });
  
  if (matchedDoctors.length === 0) matchedDoctors = MOCK_DOCTORS.slice(0, 10);
  else if (matchedDoctors.length > 10) matchedDoctors = matchedDoctors.slice(0, 10);

  return \`--- INTERNAL KNOWLEDGE BASE (Tamil Nadu Hospitals & Doctors) ---\\nHOSPITALS:\\n\${JSON.stringify(matchedHospitals.map(h => ({ id: h.id, name: h.name, city: h.cityOrDistrict, specialty: h.specialty, emergency: h.emergencyAvailable, address: h.address, rating: h.rating })), null, 2)}\\nDOCTORS:\\n\${JSON.stringify(matchedDoctors.map(d => ({ id: d.id, name: d.name, department: d.department, specialization: d.specialization, fee: d.consultationFee, availableDays: d.availableDays, rating: d.rating })), null, 2)}\\n--- INSTRUCTIONS: Use the above verified internal data to answer the user's question. Do not invent hospitals or doctors that are not in this list.\`;
}

// Instantiate the agent globally
const aiAgent = new HospitalAIAgent(process.env.GEMINI_API_KEY!);
`;

code = code.replace("// Instantiate the agent globally\nconst aiAgent = new HospitalAIAgent(process.env.GEMINI_API_KEY!);", ret);

fs.writeFileSync('server.ts', code);
