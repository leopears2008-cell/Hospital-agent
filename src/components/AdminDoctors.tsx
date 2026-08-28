import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { User, Activity, Search } from 'lucide-react';

export function AdminDoctors() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'doctor'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: any[] = [];
      snapshot.forEach(d => docs.push({ id: d.id, ...d.data() }));
      setDoctors(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="p-6">Loading doctors...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Doctors Directory</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-800">
            <tr>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {doctors.map(doc => (
              <tr key={doc.id} className="hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-900">{doc.name || 'Unknown'}</td>
                <td className="p-4">{doc.email}</td>
                <td className="p-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">Active</span></td>
              </tr>
            ))}
            {doctors.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-slate-500">No doctors registered.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
