import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Shield, ArrowRight, HeartPulse, Stethoscope, Building2, Calendar, Phone,
  CheckCircle2, Sparkles, MapPin, ShieldCheck, Menu, X,
} from 'lucide-react';
import { ProductShowcase } from './ProductShowcase';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

/** Adds `.in-view` once the element scrolls into view. */
function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('in-view'); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

/** Counts from 0 to `value` when scrolled into view. */
function StatCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / 1400);
        setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value]);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl lg:text-5xl font-black text-white tracking-tight">{n.toLocaleString()}<span className="text-[var(--brand-cyan)]">{suffix}</span></div>
      <div className="mt-2 text-sm font-medium text-slate-200">{label}</div>
    </div>
  );
}

const SERVICES = [
  { icon: Calendar, title: 'Smart Appointments', desc: 'Book, reschedule, or cancel appointments instantly. Real-time availability synchronization with hospital departments.', tint: 'bg-blue-50 text-blue-700' },
  { icon: Building2, title: 'Hospital Discovery', desc: 'Find specialized care facilities, view detailed hospital profiles, and navigate there with integrated smart maps.', tint: 'bg-indigo-50 text-indigo-700' },
  { icon: Phone, title: 'Emergency Support', desc: 'Immediate access to emergency contacts, ER directions, and rapid escalation protocols for critical situations.', tint: 'bg-rose-50 text-rose-700' },
];

export function LandingPage({ onOpenAuth }: LandingPageProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [['services', 'Services'], ['doctors', 'Doctors'], ['locations', 'Locations'], ['contact', 'Contact']];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900">
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'glass shadow-sm border-b border-slate-200/70' : 'bg-transparent border-b border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center shadow-brand"><HeartPulse className="w-6 h-6 text-white" /></div>
              <span className="text-2xl font-black tracking-tight">TN <span className="text-gradient-brand">sevai</span></span>
            </div>
            <nav className="hidden md:flex items-center gap-8 font-medium text-slate-600" aria-label="Primary">
              {links.map(([id, l]) => <a key={id} href={`#${id}`} className="hover:text-[var(--brand-blue)] transition-colors">{l}</a>)}
            </nav>
            <div className="hidden md:flex items-center gap-4">
              <button onClick={() => onOpenAuth('login')} className="text-slate-700 font-bold hover:text-[var(--brand-blue)] transition-colors">Sign In</button>
              <button onClick={() => onOpenAuth('signup')} className="bg-gradient-brand text-white px-6 py-2.5 rounded-xl font-bold shadow-brand transition-transform hover:scale-[1.03] active:scale-[0.98] flex items-center gap-2">
                Patient Portal <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <button className="md:hidden p-2 -mr-2 text-slate-700" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen} onClick={() => setMobileOpen((v) => !v)}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden glass border-t border-slate-200/70 px-4 py-4 space-y-2 animate-slide-up">
            {links.map(([id, l]) => <a key={id} href={`#${id}`} onClick={() => setMobileOpen(false)} className="block font-semibold text-slate-700 py-2">{l}</a>)}
            <div className="flex gap-3 pt-2">
              <button onClick={() => { setMobileOpen(false); onOpenAuth('login'); }} className="flex-1 border-2 border-slate-200 rounded-xl py-2.5 font-bold">Sign In</button>
              <button onClick={() => { setMobileOpen(false); onOpenAuth('signup'); }} className="flex-1 bg-gradient-brand text-white rounded-xl py-2.5 font-bold">Patient Portal</button>
            </div>
          </div>
        )}
      </header>

      <section className="relative overflow-hidden pt-40 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-white" />
        <HeartPulse className="hidden lg:block absolute top-56 left-[20%] w-10 h-10 text-[var(--brand-cyan)]/40 animate-float-slow" aria-hidden="true" />
        <Sparkles className="hidden lg:block absolute bottom-24 left-[14%] w-7 h-7 text-blue-300 animate-float" aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[var(--brand-blue)] text-sm font-bold mb-6 glow-ring">
                  <Shield className="w-4 h-4" /> Trusted Healthcare Network
                </div>
                <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-6">
                  Healthcare, <span className="text-gradient-brand">Reimagined</span><br />with AI.
                </h1>
                <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-xl">
                  Your intelligent hospital assistant for appointments, patient support, doctors, and healthcare information — available 24/7.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => onOpenAuth('signup')} className="bg-gradient-brand text-white px-8 py-4 rounded-xl font-bold text-lg shadow-brand transition-transform hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-2">
                    Book Appointment <ArrowRight className="w-5 h-5" />
                  </button>
                  <button onClick={() => onOpenAuth('signup')} className="bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2">
                    Talk to AI Assistant
                  </button>
                </div>
                <div className="mt-12 flex items-center gap-8">
                  <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map((i) => <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} className="w-12 h-12 rounded-full border-4 border-white shadow-sm" alt="" />)}
                  </div>
                  <div className="text-sm"><div className="font-black text-slate-900">10,000+</div><div className="text-slate-500 font-medium">Patients treated</div></div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="relative hidden lg:block">
                <div className="relative w-full aspect-square max-w-lg ml-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-200/50 to-cyan-200/50 rounded-full blur-3xl opacity-60" />
                  <div className="relative glass border border-slate-200 shadow-2xl rounded-3xl p-6 rotate-2 hover:rotate-0 transition-transform duration-500">
                    <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                      <div className="w-12 h-12 bg-blue-100 text-[var(--brand-blue)] rounded-2xl flex items-center justify-center"><Stethoscope className="w-6 h-6" /></div>
                      <div><div className="font-bold">Dr. Sarah Jenkins</div><div className="text-sm text-slate-500">Cardiology Dept</div></div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-2 bg-slate-100 rounded-full w-3/4" /><div className="h-2 bg-slate-100 rounded-full w-1/2" /><div className="h-2 bg-slate-100 rounded-full w-5/6" />
                    </div>
                    <div className="mt-6 flex gap-3">
                      <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100"><div className="text-xs text-slate-500 font-bold uppercase mb-1">Available</div><div className="font-black">Today, 2:00 PM</div></div>
                      <div className="w-12 bg-gradient-brand rounded-xl flex items-center justify-center"><ArrowRight className="text-white w-5 h-5" /></div>
                    </div>
                  </div>
                  <div className="absolute -bottom-10 -left-10 glass border border-slate-200 shadow-xl rounded-3xl p-5 -rotate-3 animate-float-slow">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center"><CheckCircle2 className="w-5 h-5" /></div>
                      <div><div className="font-bold">Booking Confirmed</div><div className="text-sm text-slate-500">Appointment scheduled</div></div>
                    </div>
                  </div>
                  <div className="absolute -top-6 -right-4 glass border border-slate-200 shadow-xl rounded-2xl px-4 py-3 flex items-center gap-2 animate-float">
                    <MapPin className="w-4 h-4 text-[var(--brand-cyan)]" /><span className="text-xs font-bold text-slate-700">Tamil Nadu</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-gradient-brand py-16" aria-label="Key statistics">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCard value={50} suffix="K+" label="Patients Supported" />
          <StatCard value={500} suffix="+" label="Doctors" />
          <StatCard value={100} suffix="+" label="Specialists" />
          <div className="text-center"><div className="text-4xl lg:text-5xl font-black text-white tracking-tight">24/7</div><div className="mt-2 text-sm font-medium text-slate-200">AI Assistance</div></div>
        </div>
      </section>

      <ProductShowcase />

      <section id="services" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-black tracking-tight mb-4">Enterprise Grade Healthcare</h2>
            <p className="text-slate-600 text-lg">Comprehensive hospital services unified in a single, intuitive patient portal.</p>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8">
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <div className="group h-full bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[var(--brand-cyan)] transition-all duration-300">
                  <div className={`w-14 h-14 ${s.tint} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}><s.icon className="w-7 h-7" /></div>
                  <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-slate-500 text-sm font-semibold">
          <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[var(--brand-cyan)]" /> Secure patient data</span>
          <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-[var(--brand-cyan)]" /> AI-assisted guidance</span>
        </div>
      </section>

      <footer id="contact" className="bg-slate-900 text-slate-400 py-12 mt-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6"><HeartPulse className="w-6 h-6 text-[var(--brand-cyan)]" /><span className="text-xl font-black text-white tracking-tight">TN sevai</span></div>
          <p className="mb-6 max-w-md mx-auto">Providing intelligent, AI-powered healthcare solutions to connect patients with top medical professionals seamlessly.</p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact Support</a>
          </div>
          <div className="mt-8 text-xs text-slate-500">&copy; {new Date().getFullYear()} TN sevai Platform. All rights reserved. Not intended for emergency diagnosis.</div>
        </div>
      </footer>
    </div>
  );
}
