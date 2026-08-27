import { Shield, ArrowRight, HeartPulse, Stethoscope, Building2, Calendar, Phone, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export function LandingPage({ onOpenAuth }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-900 rounded-xl flex items-center justify-center shadow-lg">
                <HeartPulse className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">TN <span className="text-blue-700">sevai</span></span>
            </div>
            <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
              <a href="#services" className="hover:text-blue-700 transition-colors">Services</a>
              <a href="#doctors" className="hover:text-blue-700 transition-colors">Doctors</a>
              <a href="#locations" className="hover:text-blue-700 transition-colors">Locations</a>
              <a href="#contact" className="hover:text-blue-700 transition-colors">Contact</a>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onOpenAuth('login')}
                className="text-slate-700 font-bold hover:text-blue-700 transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={() => onOpenAuth('signup')}
                className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2.5 rounded-xl font-bold shadow-md transition-all flex items-center gap-2"
              >
                Patient Portal <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-16 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-white"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-bold mb-6">
                <Shield className="w-4 h-4" /> Trusted Healthcare Network
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight mb-6">
                Smarter Healthcare.<br/>
                <span className="text-blue-800">Better Patient Support.</span>
              </h1>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-xl">
                One intelligent platform connecting you with top hospitals, specialist doctors, and AI-powered health assistance.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => onOpenAuth('signup')}
                  className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
                >
                  Book Appointment <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => onOpenAuth('signup')}
                  className="bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
                >
                  Ask AI Assistant
                </button>
              </div>

              <div className="mt-12 flex items-center gap-8">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-12 h-12 rounded-full border-4 border-white shadow-sm" alt="Patient" />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="font-black text-slate-900">10,000+</div>
                  <div className="text-slate-500 font-medium">Patients treated</div>
                </div>
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              {/* Abstract dashboard graphic representation instead of a raw image */}
              <div className="relative w-full aspect-square max-w-lg ml-auto">
                <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                <div className="relative bg-white border border-slate-200 shadow-2xl rounded-3xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Dr. Sarah Jenkins</div>
                      <div className="text-sm text-slate-500">Cardiology Dept</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-2 bg-slate-100 rounded-full w-3/4"></div>
                    <div className="h-2 bg-slate-100 rounded-full w-1/2"></div>
                    <div className="h-2 bg-slate-100 rounded-full w-5/6"></div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <div className="text-xs text-slate-500 font-bold uppercase mb-1">Available</div>
                      <div className="font-black text-slate-900">Today, 2:00 PM</div>
                    </div>
                    <div className="w-12 bg-blue-900 rounded-xl flex items-center justify-center">
                      <ArrowRight className="text-white w-5 h-5" />
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-10 -left-10 bg-white border border-slate-200 shadow-xl rounded-3xl p-5 transform -rotate-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Booking Confirmed</div>
                      <div className="text-sm text-slate-500">Appointment scheduled</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="services" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-4">Enterprise Grade Healthcare</h2>
            <p className="text-slate-600 text-lg">Comprehensive hospital services unified in a single, intuitive patient portal.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center mb-6">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Appointments</h3>
              <p className="text-slate-600 leading-relaxed">Book, reschedule, or cancel appointments instantly. Real-time availability synchronization with hospital departments.</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center justify-center mb-6">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Hospital Discovery</h3>
              <p className="text-slate-600 leading-relaxed">Find specialized care facilities, view detailed hospital profiles, and navigate there with integrated smart maps.</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-rose-50 text-rose-700 rounded-2xl flex items-center justify-center mb-6">
                <Phone className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Emergency Support</h3>
              <p className="text-slate-600 leading-relaxed">Immediate access to emergency contacts, ER directions, and rapid escalation protocols for critical situations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <HeartPulse className="w-6 h-6 text-blue-500" />
            <span className="text-xl font-black text-white tracking-tight">TN sevai</span>
          </div>
          <p className="mb-6 max-w-md mx-auto">Providing intelligent, AI-powered healthcare solutions to connect patients with top medical professionals seamlessly.</p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Support</a>
          </div>
          <div className="mt-8 text-xs text-slate-600">
            &copy; {new Date().getFullYear()} TN sevai Platform. All rights reserved. Not intended for emergency diagnosis.
          </div>
        </div>
      </footer>
    </div>
  );
}
