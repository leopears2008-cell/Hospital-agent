import { useState, FormEvent } from 'react';
import { X, Sparkles, Send, ShieldAlert, Phone, MapPin, Bed, Star, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Hospital, TriageResult } from '../types';

interface AiAssistantModalProps {
  onClose: () => void;
  onSelectHospital: (hospital: Hospital) => void;
}

export function AiAssistantModal({ onClose, onSelectHospital }: AiAssistantModalProps) {
  const [query, setQuery] = useState('');
  const [district, setDistrict] = useState('Chennai');
  const [specialty, setSpecialty] = useState('Multi-Specialty');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TriageResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, district, specialty }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'Failed to fetch recommendations');
      }
    } catch (err: any) {
      setError(err.message || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-400 text-slate-900 text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Powered by Gemini
            </span>
          </div>
          <h2 className="text-xl font-bold mb-1">Leo AI Chat</h2>
          <p className="text-xs text-blue-100">Describe your medical situation, symptoms, or care needs for instant AI guidance.</p>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Describe Symptoms / Care Requirement</label>
              <textarea
                rows={3}
                placeholder="e.g., Severe chest pain and shortness of breath in Chennai, or looking for best orthopedic surgeon in Coimbatore..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Preferred District</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Chennai">Chennai</option>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Madurai">Madurai</option>
                  <option value="Vellore">Vellore</option>
                  <option value="Tiruchirappalli">Tiruchirappalli (Trichy)</option>
                  <option value="Salem">Salem</option>
                  <option value="Tirunelveli">Tirunelveli</option>
                  <option value="Anywhere in Tamil Nadu">Anywhere in Tamil Nadu</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Medical Specialty</label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Multi-Specialty">Multi-Specialty</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Orthopedics & Trauma">Orthopedics & Trauma</option>
                  <option value="Emergency Care">Emergency Care</option>
                  <option value="Oncology">Oncology</option>
                  <option value="Pediatrics">Pediatrics</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-xl shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin text-amber-300" />
                  <span>Analyzing Medical Request...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Get AI Recommendations & Triage</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-xs font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="space-y-6 pt-4 border-t border-slate-200 animate-in fade-in duration-300">
              {/* Triage Guidance */}
              <div className="bg-amber-50 border border-amber-200/60 p-4 rounded-xl">
                <h4 className="font-bold text-amber-900 text-sm mb-1 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600" /> Medical Triage Advice
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed">{result.triageAdvice}</p>
              </div>

              {/* Emergency Numbers */}
              {result.emergencyNumbers && result.emergencyNumbers.length > 0 && (
                <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold text-rose-800">Emergency Helplines:</span>
                  <div className="flex items-center gap-3">
                    {result.emergencyNumbers.map((item, idx) => (
                      <a key={idx} href={`tel:${item.number}`} className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-3 py-1 rounded-lg font-semibold flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {item.name}: {item.number}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Hospitals */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-3">Recommended Hospitals</h4>
                <div className="space-y-3">
                  {result.recommendations.map((h, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl hover:border-blue-500 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">{h.cityOrDistrict}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-full">{h.specialty}</span>
                        </div>
                        <h5 className="font-bold text-slate-900 text-sm">{h.name}</h5>
                        <p className="text-xs text-slate-500">{h.address}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={`tel:${h.contactNumber}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" /> Call
                        </a>
                        <button
                          onClick={() => {
                            onSelectHospital(h);
                            onClose();
                          }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
