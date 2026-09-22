import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Activity, Settings as SettingsIcon, 
  LogOut, Shield, FileText, Database, Calendar as CalendarIcon 
, Bell, X } from 'lucide-react';
import { supabase } from './lib/supabase';
import { useAuthGuard } from './lib/auth-guard';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminAppointments } from './components/AdminAppointments';
import { AdminPatients } from './components/AdminPatients';
import { AdminSettings } from './components/AdminSettings';
import { AdminAuditLogs } from './components/AdminAuditLogs';
import { AdminDoctors } from './components/AdminDoctors';
import { AdminUsers } from './components/AdminUsers';

// Mock components for remaining new routes



export default function AdminApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, loading } = useAuthGuard();
  const [authorized, setAuthorized] = useState(true);
  const [toasts, setToasts] = useState<{id: string, message: string}[]>([]);

  useEffect(() => {
    if (!authorized) return;
    let initialLoad = true;
    
    const channel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'appointments' },
        (payload) => {
          const appt = payload.new;
          const id = appt.id;
          const message = `New appointment requested by ${appt.patientName || 'a patient'}.`;
          
          setToasts(prev => {
            if (prev.find(t => t.id === id)) return prev;
            return [{ id, message }, ...prev].slice(0, 5);
          });
          
          setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
          }, 5000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authorized]);

  
  
  if (!authorized) return null;

  const handleLogout = async () => {
    window.location.href = '/';
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/appointments', icon: CalendarIcon, label: 'Appointments' },
    { path: '/admin/patients', icon: Users, label: 'Patients' },
    { path: '/admin/doctors', icon: Activity, label: 'Doctors' },
    { path: '/admin/users', icon: Shield, label: 'User Roles' },
    { path: '/admin/settings', icon: SettingsIcon, label: 'Settings' },
    { path: '/admin/audit-logs', icon: FileText, label: 'Audit Logs' },
  ];

  return (
    <div className="flex h-screen w-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <Shield className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="font-bold text-lg tracking-tight">Hospital Admin</h1>
            <p className="text-xs text-slate-400">Enterprise Portal</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-rose-400 hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0">
          <h2 className="text-lg font-bold text-slate-800">
            {navItems.find(i => i.path === location.pathname)?.label || 'Administration'}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              {user?.email}
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <Routes>
            <Route path="dashboard" element={<AdminDashboard appointments={[]} hospitals={[]} />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="patients" element={<AdminPatients />} />
            <Route path="doctors" element={<AdminDoctors />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="audit-logs" element={<AdminAuditLogs />} />
          </Routes>
        </main>
        
        {/* Toast Notifications */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
          {toasts.map(toast => (
            <div key={toast.id} className="bg-white border border-slate-200 shadow-xl rounded-xl p-4 flex items-start gap-4 min-w-[300px] animate-in slide-in-from-right-8 duration-300">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-full shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1 pt-0.5">
                <h4 className="text-sm font-bold text-slate-800">New Request</h4>
                <p className="text-sm text-slate-600 mt-1">{toast.message}</p>
              </div>
              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
