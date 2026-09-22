const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const newGetContext = `async function retrieveKnowledgeBase(query: string) {
  const keywords = query.toLowerCase().split(' ').filter(w => w.length > 3);
  
  try {
    const { db } = require('./src/db/index.ts');
    const { hospitals, doctors } = require('./src/db/schema.ts');
    
    const allHospitals = await db.select().from(hospitals).all();
    let matchedHospitals = allHospitals.filter((h: any) => {
      const searchString = \`\${h.name} \${h.cityOrDistrict} \${h.specialty} \${h.address}\`.toLowerCase();
      return keywords.some(k => searchString.includes(k));
    });
    if (matchedHospitals.length === 0) matchedHospitals = allHospitals.slice(0, 15);
    else if (matchedHospitals.length > 15) matchedHospitals = matchedHospitals.slice(0, 15);

    const allDoctors = await db.select().from(doctors).all();
    let matchedDoctors = allDoctors.filter((d: any) => {
      const searchString = \`\${d.name} \${d.department} \${d.specialization}\`.toLowerCase();
      return keywords.some(k => searchString.includes(k));
    });
    if (matchedDoctors.length === 0) matchedDoctors = allDoctors.slice(0, 10);
    else if (matchedDoctors.length > 10) matchedDoctors = matchedDoctors.slice(0, 10);

    return \`--- INTERNAL KNOWLEDGE BASE (Tamil Nadu Hospitals & Doctors) ---\\nHOSPITALS:\\n\${JSON.stringify(matchedHospitals.map((h: any) => ({ id: h.id, name: h.name, city: h.cityOrDistrict, specialty: h.specialty, emergency: h.emergencyAvailable, address: h.address, rating: h.rating })), null, 2)}\\nDOCTORS:\\n\${JSON.stringify(matchedDoctors.map((d: any) => ({ id: d.id, name: d.name, department: d.department, specialization: d.specialization, fee: d.consultationFee, availableDays: typeof d.availableDays === 'string' ? JSON.parse(d.availableDays) : d.availableDays, rating: d.rating })), null, 2)}\\n--- INSTRUCTIONS: Use the above verified internal data to answer the user's question. Do not invent hospitals or doctors that are not in this list.\`;
  } catch (e) {
    console.error("Simple context error:", e);
    return "";
  }
}`;

content = content.replace(/function retrieveKnowledgeBase[\s\S]*?(?=\n\/\/ Instantiate)/, newGetContext);

fs.writeFileSync('server.ts', content);
