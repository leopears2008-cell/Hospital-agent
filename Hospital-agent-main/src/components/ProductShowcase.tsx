import { useState } from 'react';
import {
  LayoutDashboard, CalendarDays, Users, Stethoscope, Building2, BarChart3,
  MessageSquare, Settings, LogOut, HeartPulse, Search, Bell, BedDouble,
  Smartphone, Bot, FileText, Clock, Droplet, AlertCircle,
} from 'lucide-react';

/**
 * Visual product showcase (design only). All figures below are SAMPLE DATA
 * for presentation; nothing here reads from or writes to the backend.
 * Photography: drop licensed images into /public/images/showcase/ using the
 * file names passed to <PhotoSlot>; a gradient is shown until they exist.
 */

function PhotoSlot({ src, label, className = '' }: { src: string; label: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-[var(--brand-blue)] to-[var(--brand-cyan)] ${className}`}>
      {!failed && (
        <img src={src} alt={label} loading="lazy" onError={() => setFailed(true)} className="absolute inset-0 w-full h-full object-cover" />
      )}
      {failed && <span className="absolute bottom-2 left-3 text-[10px] font-semibold text-white/80">{label}</span>}
    </div>
  );
}

function Avatar({ name, tone = 'bg-blue-100 text-blue-800' }: { name: string; tone?: string }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((n) => n[0]).join('');
  return <span className={`inline-flex w-7 h-7 rounded-full items-center justify-center text-[10px] font-bold ${tone}`}>{initials}</span>;
}

const STATUS: Record<string, string> = {
  Confirmed: 'bg-emerald-50 text-emerald-700',
  Pending: 'bg-amber-50 text-amber-700',
  Completed: 'bg-blue-50 text-blue-700',
  Cancelled: 'bg-rose-50 text-rose-700',
};

const APPTS = [
  { p: 'Arun Kumar', d: 'Dr. Meena R.', dep: 'Cardiology', t: '09:30 AM', s: 'Confirmed' },
  { p: 'Lakshmi S.', d: 'Dr. Karthik V.', dep: 'Neurology', t: '10:15 AM', s: 'Pending' },
  { p: 'Rahul Nair', d: 'Dr. Anitha P.', dep: 'Pediatrics', t: '11:00 AM', s: 'Completed' },
  { p: 'Fatima B.', d: 'Dr. Suresh M.', dep: 'Orthopedics', t: '12:20 PM', s: 'Confirmed' },
];

const glass = 'bg-white/85 backdrop-blur-xl border border-white/70 rounded-3xl shadow-[0_30px_60px_-20px_rgba(15,40,90,0.35)]';

function AdminDashboard() {
  const kpis = [
    { icon: CalendarDays, label: 'Total Appointments', v: '1,248', c: '+12.5%' },
    { icon: Users, label: 'Total Patients', v: '8,436', c: '+8.2%' },
    { icon: Stethoscope, label: 'Doctors', v: '52', c: '+4.0%' },
    { icon: BedDouble, label: 'Bed Availability', v: '128', c: '-2.1%' },
  ];
  const nav = [
    [LayoutDashboard, 'Dashboard'], [CalendarDays, 'Appointments'], [Users, 'Patients'], [Stethoscope, 'Doctors'],
    [Building2, 'Departments'], [BarChart3, 'Reports'], [MessageSquare, 'Messages'], [Settings, 'Settings'], [LogOut, 'Logout'],
  ] as const;
  return (
    <div className={`${glass} flex overflow-hidden text-slate-800`} role="img" aria-label="Sample admin dashboard preview">
      <aside className="hidden sm:block w-36 bg-[var(--brand-blue)] text-slate-300 p-4 shrink-0">
        <div className="flex items-center gap-2 text-white font-bold text-xs mb-5"><HeartPulse className="w-4 h-4 text-[var(--brand-cyan)]" /> TN sevai</div>
        <ul className="space-y-1">
          {nav.map(([Icon, l], i) => (
            <li key={l} className={`flex items-center gap-2 text-[11px] rounded-lg px-2 py-1.5 ${i === 0 ? 'bg-white/10 text-white' : ''}`}><Icon className="w-3.5 h-3.5" />{l}</li>
          ))}
        </ul>
      </aside>
      <div className="flex-1 p-4 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="text-sm font-bold truncate">Good Morning, Dr. Priya Nair</div>
          <div className="flex items-center gap-2 text-slate-400"><Search className="w-4 h-4" /><Bell className="w-4 h-4" /><Avatar name="Priya Nair" tone="bg-cyan-100 text-cyan-800" /></div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
          {kpis.map(({ icon: Icon, label, v, c }) => (
            <div key={label} className="rounded-2xl bg-white border border-slate-100 p-2.5 shadow-sm">
              <Icon className="w-4 h-4 text-[var(--brand-blue)] mb-1" />
              <div className="text-[10px] text-slate-500">{label}</div>
              <div className="text-base font-black">{v}</div>
              <div className={`text-[10px] font-semibold ${c.startsWith('-') ? 'text-rose-600' : 'text-emerald-600'}`}>{c} vs last month</div>
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-2 mb-3">
          <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-100 p-3">
            <div className="text-[11px] font-bold mb-1">Appointments Overview</div>
            <svg viewBox="0 0 240 70" className="w-full h-16" aria-hidden="true">
              <polyline fill="none" stroke="var(--brand-blue)" strokeWidth="2" points="0,55 30,42 60,48 90,28 120,34 150,18 180,26 210,10 240,16" />
              <polyline fill="none" stroke="var(--brand-cyan)" strokeWidth="2" strokeDasharray="4 3" points="0,60 30,52 60,54 90,40 120,44 150,32 180,38 210,26 240,30" />
            </svg>
            <div className="flex gap-3 text-[10px] text-slate-500"><span className="text-[var(--brand-blue)]">● Booked</span><span className="text-teal-600">● Completed</span></div>
          </div>
          <div className="rounded-2xl bg-white border border-slate-100 p-3">
            <div className="text-[11px] font-bold mb-1">Patients by Department</div>
            <svg viewBox="0 0 42 42" className="w-16 h-16 mx-auto -rotate-90" aria-hidden="true">
              <circle cx="21" cy="21" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="6" />
              <circle cx="21" cy="21" r="15.9" fill="none" stroke="var(--brand-blue)" strokeWidth="6" strokeDasharray="40 60" />
              <circle cx="21" cy="21" r="15.9" fill="none" stroke="var(--brand-cyan)" strokeWidth="6" strokeDasharray="25 75" strokeDashoffset="-40" />
              <circle cx="21" cy="21" r="15.9" fill="none" stroke="#f59e0b" strokeWidth="6" strokeDasharray="15 85" strokeDashoffset="-65" />
            </svg>
          </div>
        </div>
        <table className="w-full text-[10px]">
          <caption className="sr-only">Sample recent appointments</caption>
          <tbody>
            {APPTS.map((a) => (
              <tr key={a.p} className="border-t border-slate-100">
                <td className="py-1.5"><span className="flex items-center gap-1.5"><Avatar name={a.p} />{a.p}</span></td>
                <td className="hidden md:table-cell">{a.d}</td>
                <td className="hidden md:table-cell">{a.dep}</td>
                <td>{a.t}</td>
                <td><span className={`px-2 py-0.5 rounded-full font-semibold ${STATUS[a.s]}`}>{a.s}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AppointmentsPanel() {
  return (
    <div className={`${glass} p-4`}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-bold">Appointments</div>
        <span className="text-[11px] font-bold bg-gradient-brand text-white rounded-lg px-3 py-1.5">+ New Appointment</span>
      </div>
      <div className="flex gap-1 mb-3 text-[11px] font-semibold">
        {['Upcoming', 'Completed', 'Cancelled'].map((t, i) => (
          <span key={t} className={`px-3 py-1 rounded-full ${i === 0 ? 'bg-[var(--brand-blue)] text-white' : 'bg-slate-100 text-slate-600'}`}>{t}</span>
        ))}
      </div>
      <ul className="space-y-2">
        {APPTS.slice(0, 3).map((a) => (
          <li key={a.p} className="flex items-center justify-between rounded-xl bg-white border border-slate-100 p-2 text-[11px]">
            <span className="flex items-center gap-2"><Avatar name={a.p} /><span><b>{a.p}</b><br /><span className="text-slate-500">{a.d} · {a.dep}</span></span></span>
            <span className="text-right"><Clock className="inline w-3 h-3 mr-1" />{a.t}<br /><span className={`px-2 py-0.5 rounded-full font-semibold ${STATUS[a.s]}`}>{a.s}</span></span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PatientPanel() {
  return (
    <div className={`${glass} p-4 text-[11px]`}>
      <div className="flex items-center gap-3 mb-3">
        <span className="w-12 h-12 rounded-full bg-gradient-brand text-white flex items-center justify-center font-bold">AK</span>
        <div><div className="text-sm font-bold">Arun Kumar</div><div className="text-slate-500">ID: P-000123 · 42 · Male</div></div>
      </div>
      <dl className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-white border border-slate-100 p-2"><dt className="text-slate-500 flex items-center gap-1"><Droplet className="w-3 h-3" />Blood group</dt><dd className="font-bold">B+</dd></div>
        <div className="rounded-xl bg-white border border-slate-100 p-2"><dt className="text-slate-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />Allergies</dt><dd className="font-bold">Penicillin</dd></div>
        <div className="rounded-xl bg-white border border-slate-100 p-2 col-span-2"><dt className="text-slate-500 flex items-center gap-1"><FileText className="w-3 h-3" />Reports · Prescriptions</dt><dd className="font-bold">3 reports · 2 active prescriptions</dd></div>
      </dl>
    </div>
  );
}

function DoctorPanel() {
  return (
    <div className={`${glass} overflow-hidden text-[11px]`}>
      <PhotoSlot src="/images/showcase/doctor-portrait.jpg" label="Doctor portrait (add licensed photo)" className="h-28" />
      <div className="p-4">
        <div className="text-sm font-bold">Dr. Meena R.</div>
        <div className="text-slate-500 mb-2">Cardiology · 12 yrs experience</div>
        <div className="flex gap-2">
          <span className="rounded-lg bg-slate-100 px-2 py-1">Mon–Sat · 9 AM–5 PM</span>
          <span className="rounded-lg bg-emerald-50 text-emerald-700 px-2 py-1 font-semibold">Available</span>
        </div>
      </div>
    </div>
  );
}

function PhoneMockup() {
  return (
    <div className="mx-auto w-44 rounded-[2rem] bg-slate-900 p-2 shadow-[0_30px_60px_-20px_rgba(15,40,90,0.5)]">
      <div className="rounded-[1.5rem] bg-white overflow-hidden text-[10px] min-h-[19rem] flex flex-col">
        <div className="bg-gradient-brand text-white p-3"><div className="font-bold text-xs">Hello, Arun</div><div className="opacity-80">Next: Cardiology · Tomorrow 9:30</div></div>
        <div className="p-3 grid grid-cols-2 gap-2 flex-1 content-start">
          {[[CalendarDays, 'Book'], [Clock, 'My Visits'], [FileText, 'Reports'], [Bot, 'Chat AI']].map(([Icon, l]) => {
            const I = Icon as typeof CalendarDays;
            return <div key={l as string} className="rounded-xl bg-slate-50 border border-slate-100 p-2 text-center font-semibold"><I className="w-4 h-4 mx-auto mb-1 text-[var(--brand-blue)]" />{l as string}</div>;
          })}
        </div>
        <div className="flex justify-around border-t border-slate-100 py-2 text-slate-400"><HeartPulse className="w-4 h-4" /><CalendarDays className="w-4 h-4" /><Bot className="w-4 h-4" /><Smartphone className="w-4 h-4" /></div>
      </div>
    </div>
  );
}

export function ProductShowcase() {
  return (
    <section id="showcase" className="relative py-24 overflow-hidden bg-gradient-to-b from-white via-blue-50/60 to-white">
      <div className="absolute -top-24 right-0 w-[32rem] h-[32rem] rounded-full bg-[var(--brand-cyan)]/15 blur-3xl" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl lg:text-4xl font-black tracking-tight mb-3">Smart Hospital Management, in one platform</h2>
          <p className="text-slate-600 text-lg">Streamline hospital operations with intelligent, secure and easy-to-use technology.</p>
          <p className="text-xs text-slate-400 mt-2">Interface previews use sample data.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start [perspective:1800px]">
          <div className="lg:col-span-8 transition-transform duration-700 lg:[transform:rotateY(-6deg)_rotateX(3deg)] hover:[transform:rotateY(0)_rotateX(0)]">
            <AdminDashboard />
          </div>
          <div className="lg:col-span-4 space-y-6 transition-transform duration-700 lg:[transform:rotateY(-8deg)] hover:[transform:rotateY(0)]">
            <PhotoSlot src="/images/showcase/hospital-exterior.jpg" label="Hospital exterior (add licensed photo)" className="h-40 rounded-3xl shadow-lg" />
            <AppointmentsPanel />
          </div>
          <div className="lg:col-span-4"><PatientPanel /></div>
          <div className="lg:col-span-4"><DoctorPanel /></div>
          <div className="lg:col-span-4"><PhoneMockup /></div>
        </div>
      </div>
    </section>
  );
}
