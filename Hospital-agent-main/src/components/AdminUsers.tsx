import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { Shield } from 'lucide-react';

export function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allUsers: any[] = [];
      snapshot.forEach(d => allUsers.push({ id: d.id, ...d.data() }));
      setUsers(allUsers);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="p-6">Loading users...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">System Users (RBAC)</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-800">
            <tr>
              <th className="p-4 font-semibold">User ID</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="p-4 font-mono text-xs">{u.id}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase
                    ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                      u.role === 'doctor' ? 'bg-emerald-100 text-emerald-800' : 
                      'bg-slate-100 text-slate-800'}`}>
                    {u.role || 'patient'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
