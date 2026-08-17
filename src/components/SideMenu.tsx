import { useState, useEffect } from 'react';
import { X, Activity, Thermometer, HeartPulse, Stethoscope, Phone, Save, TrendingUp, User as UserIcon, LogOut } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { User } from '../types';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onLogout: () => void;
}

export function SideMenu({ isOpen, onClose, currentUser, onLogout }: SideMenuProps) {
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const [bmiHistory, setBmiHistory] = useState<{ date: string; bmi: number }[]>([]);
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('bmiHistory');
    if (saved) {
      try {
        setBmiHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing BMI history', e);
      }
    }
  }, []);

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(height) / 100; // cm to m
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      const bmi = w / (h * h);
      setBmiResult(parseFloat(bmi.toFixed(1)));
    }
  };

  const saveBMI = () => {
    if (bmiResult === null) return;
    
    // Create a new entry with current date
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    const newEntry = { date: today, bmi: bmiResult };
    
    const updatedHistory = [...bmiHistory, newEntry];
    setBmiHistory(updatedHistory);
    localStorage.setItem('bmiHistory', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setBmiHistory([]);
    localStorage.removeItem('bmiHistory');
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500' };
    if (bmi >= 18.5 && bmi < 24.9) return { label: 'Normal weight', color: 'text-emerald-500' };
    if (bmi >= 25 && bmi < 29.9) return { label: 'Overweight', color: 'text-amber-500' };
    return { label: 'Obese', color: 'text-rose-500' };
  };

  const SYMPTOMS = [
    { id: 'chest', label: 'Severe Chest Pain', icon: HeartPulse, type: 'emergency', advice: 'Possible heart attack. Call 108 immediately or go to the nearest emergency room. Do not drive yourself.' },
    { id: 'fever', label: 'High Fever (>102°F)', icon: Thermometer, type: 'urgent', advice: 'Take paracetamol. If fever persists for >3 days, or is accompanied by chills/rash, consult a general physician.' },
    { id: 'breathing', label: 'Difficulty Breathing', icon: Activity, type: 'emergency', advice: 'Severe shortness of breath is a medical emergency. Call 108 or seek immediate trauma care.' },
    { id: 'general', label: 'General Fatigue/Ache', icon: Stethoscope, type: 'routine', advice: 'Rest and hydrate. If symptoms persist for a week, book an outpatient appointment with a general physician.' }
  ];

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/50 z-40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed inset-y-0 left-0 w-80 bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Tools & Features
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded transition-colors text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* User Profile / Logout section at top */}
          {currentUser && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{currentUser.name}</p>
                  <p className="text-xs text-slate-500">{currentUser.email}</p>
                </div>
              </div>
              <button 
                onClick={onLogout}
                className="p-2 text-rose-500 hover:bg-rose-100 rounded-full transition-colors flex items-center justify-center"
                title="Log out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* BMI Calculator Section */}
          <div className="bg-slate-50 rounded border border-slate-200 p-4">
            <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
              BMI Calculator
            </h3>
            <p className="text-xs text-slate-500 mb-4">Calculate your weight relative to your height.</p>
            
            <form onSubmit={calculateBMI} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Height (cm)</label>
                <input 
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
                  placeholder="e.g. 175"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Weight (kg)</label>
                <input 
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
                  placeholder="e.g. 70"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded text-sm transition-colors cursor-pointer"
              >
                Calculate BMI
              </button>
            </form>

            {bmiResult !== null && (
              <div className="mt-4 p-3 bg-white rounded border border-slate-200 text-center">
                <p className="text-xs text-slate-500 mb-1">Your BMI is</p>
                <p className="text-2xl font-black text-slate-800 mb-1">{bmiResult}</p>
                <p className={`text-xs font-bold ${getBMICategory(bmiResult).color}`}>
                  {getBMICategory(bmiResult).label}
                </p>
                <button 
                  onClick={saveBMI}
                  className="mt-3 w-full border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold py-1.5 rounded flex items-center justify-center gap-1 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" /> Save to History
                </button>
              </div>
            )}
          </div>

          {/* BMI History Recharts Tracker */}
          {bmiHistory.length > 0 && (
            <div className="bg-slate-50 rounded border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  BMI Trend
                </h3>
                <button onClick={clearHistory} className="text-[10px] text-slate-400 hover:text-rose-500 transition-colors">Clear</button>
              </div>
              <div className="h-40 w-full bg-white rounded border border-slate-100 p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bmiHistory}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="date" 
                      fontSize={9} 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: '#94a3b8' }} 
                    />
                    <YAxis 
                      domain={['dataMin - 2', 'dataMax + 2']} 
                      fontSize={9} 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: '#94a3b8' }} 
                      width={25}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }} 
                      itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="bmi" 
                      stroke="#2563eb" 
                      strokeWidth={3}
                      dot={{ r: 3, fill: '#2563eb', strokeWidth: 0 }} 
                      activeDot={{ r: 5, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Quick Triage / Symptom Guide */}
          <div className="bg-slate-50 rounded border border-slate-200 p-4">
            <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              Symptom Triage Guide
            </h3>
            <p className="text-xs text-slate-500 mb-4">Select a symptom to see recommended actions.</p>
            
            <div className="space-y-2">
              {SYMPTOMS.map(symptom => {
                const Icon = symptom.icon;
                const isSelected = selectedSymptom === symptom.id;
                return (
                  <div key={symptom.id}>
                    <button
                      onClick={() => setSelectedSymptom(isSelected ? null : symptom.id)}
                      className={`w-full flex items-center gap-2 p-2.5 rounded text-left transition-colors border text-sm font-medium ${
                        isSelected 
                          ? 'bg-blue-50 border-blue-200 text-blue-700' 
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="flex-1">{symptom.label}</span>
                    </button>
                    
                    {isSelected && (
                      <div className={`mt-2 p-3 rounded border text-xs leading-relaxed ${
                        symptom.type === 'emergency' ? 'bg-rose-50 border-rose-200 text-rose-800' :
                        symptom.type === 'urgent' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                        'bg-slate-100 border-slate-200 text-slate-700'
                      }`}>
                        {symptom.advice}
                        {symptom.type === 'emergency' && (
                          <a href="tel:108" className="mt-2 w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-1.5 rounded flex items-center justify-center gap-1.5 transition-colors">
                            <Phone className="w-3.5 h-3.5" /> Call 108 Now
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-400 mt-4 italic text-center">Disclaimer: This is not medical advice. Consult a doctor for accurate diagnosis.</p>
          </div>
        </div>
      </div>
    </>
  );
}
