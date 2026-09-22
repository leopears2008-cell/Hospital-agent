import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { FileText } from 'lucide-react';

export function AdminAuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'audit_logs'), orderBy('timestamp', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logData: any[] = [];
      snapshot.forEach(d => logData.push({ id: d.id, ...d.data() }));
      setLogs(logData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="p-6">Loading audit logs...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
        <FileText className="w-6 h-6" /> Audit Logs
      </h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-800">
            <tr>
              <th className="p-4 font-semibold">Timestamp</th>
              <th className="p-4 font-semibold">Admin / User</th>
              <th className="p-4 font-semibold">Action</th>
              <th className="p-4 font-semibold">Resource</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-slate-50">
                <td className="p-4">{log.timestamp ? new Date(log.timestamp.toDate()).toLocaleString() : 'N/A'}</td>
                <td className="p-4 font-medium text-slate-900">{log.metadata?.email || log.adminId || 'System'}</td>
                <td className="p-4"><span className="px-2 py-1 bg-slate-100 rounded font-mono text-xs">{log.action}</span></td>
                <td className="p-4">{log.resource}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">No audit logs recorded yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
