export interface KnowledgeDocument {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
}

const MEDICAL_KNOWLEDGE_BASE: KnowledgeDocument[] = [
  {
    id: 'doc_1',
    title: 'Emergency Triage Protocol (Tamil Nadu Guidelines)',
    category: 'Emergency',
    content: 'Immediate assessment within 60 seconds of arrival. Categorize into Red (Resuscitation), Yellow (Urgent), and Green (Non-urgent). Ensure airway and vital signs stabilization.',
    tags: ['emergency', 'triage', 'protocols'],
  },
  {
    id: 'doc_2',
    title: 'Cardiac Arrest Response & CPR Standard',
    category: 'Cardiology',
    content: 'Begin chest compressions at 100-120 bpm at a depth of 2 inches. Attach Automated External Defibrillator (AED) as soon as available. Minimize interruptions in compressions.',
    tags: ['cpr', 'cardiac', 'emergency'],
  },
  {
    id: 'doc_3',
    title: 'Dengue Fever Management & Fluid Protocol',
    category: 'Infectious Disease',
    content: 'Monitor platelet counts and hematocrit levels every 6 hours. Administer crystalloid IV fluids judiciously in shock cases to avoid fluid overload. Avoid NSAIDs.',
    tags: ['dengue', 'fever', 'protocols'],
  },
];

export function searchMedicalKnowledge(query: string): KnowledgeDocument[] {
  if (!query || query.trim() === '') {
    return MEDICAL_KNOWLEDGE_BASE;
  }
  const q = query.toLowerCase();
  return MEDICAL_KNOWLEDGE_BASE.filter(
    doc => doc.title.toLowerCase().includes(q) || doc.content.toLowerCase().includes(q) || doc.tags.some(t => t.toLowerCase().includes(q))
  );
}
