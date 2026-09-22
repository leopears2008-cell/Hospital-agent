import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { User, Activity, Search } from 'lucide-react';

export function AdminPatients() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'patient'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pts: any[] = [];
      snapshot.forEach(d => pts.push({ id: d.id, ...d.data() }));
      setPatients(pts);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="p-6">Loading patients...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Patients Directory</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-800">
            <tr>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {patients.map(pt => (
              <tr key={pt.id} className="hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-900 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {pt.name?.charAt(0) || 'U'}
                  </div>
                  {pt.name || 'Unknown'}
                </td>
                <td className="p-4">{pt.email}</td>
                <td className="p-4">
                  {pt.createdAt ? new Date(pt.createdAt).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-slate-500">No patients registered.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
