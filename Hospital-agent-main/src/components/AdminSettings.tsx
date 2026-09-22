import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Settings as SettingsIcon, Save } from 'lucide-react';

export function AdminSettings() {
  const [features, setFeatures] = useState({
    aiAssistant: true,
    onlineConsultation: true,
    smsNotifications: false,
    patientRegistration: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, 'settings', 'features');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setFeatures(snap.data() as any);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'features'), features);
      alert("Settings saved successfully.");
    } catch (err: any) {
      alert("Failed to save settings: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading settings...</div>;

  return (
    <div className="p-6 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
        <SettingsIcon className="w-6 h-6" /> Feature Controls
      </h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-slate-800">AI Assistant</h3>
            <p className="text-sm text-slate-500">Enable or disable the Leo AI Chatbot across the platform.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={features.aiAssistant} onChange={e => setFeatures({...features, aiAssistant: e.target.checked})} />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-slate-800">Patient Registration</h3>
            <p className="text-sm text-slate-500">Allow new patients to create accounts.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={features.patientRegistration} onChange={e => setFeatures({...features, patientRegistration: e.target.checked})} />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-slate-800">Online Consultations</h3>
            <p className="text-sm text-slate-500">Enable video/online booking flows.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={features.onlineConsultation} onChange={e => setFeatures({...features, onlineConsultation: e.target.checked})} />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex justify-end pt-4">
          <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
