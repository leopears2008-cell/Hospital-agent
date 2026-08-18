import { Shield, Sparkles, PhoneCall, LogOut, User as UserIcon, LogIn, UserPlus, Menu } from 'lucide-react';
import { User } from '../types';
import { EmergencyAlertsToggle } from './EmergencyAlertsToggle';

interface NavbarProps {
  onOpenSideMenu: () => void;
  onOpenAiAssistant: () => void;
  viewMode: 'dashboard' | 'split' | 'map' | 'list';
  setViewMode: (mode: 'dashboard' | 'split' | 'map' | 'list') => void;
  totalHospitals: number;
  currentUser: User | null;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onLogout: () => void;
  onOpenAppointments: () => void;
}

export function Navbar({ onOpenSideMenu, onOpenAiAssistant, viewMode, setViewMode, totalHospitals, currentUser, onOpenAuth, onLogout, onOpenAppointments }: NavbarProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Emergency Top Bar */}
      <div className="bg-slate-900 text-white px-6 py-2 text-xs font-medium flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-300 uppercase tracking-wider text-[11px] font-bold">Tamil Nadu Emergency & Disaster Helplines:</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="tel:108" className="bg-rose-600 hover:bg-rose-700 px-3 py-1 rounded text-white flex items-center gap-1.5 transition-colors font-bold shadow-xs">
            <PhoneCall className="w-3.5 h-3.5" /> Ambulance: 108
          </a>
          <a href="tel:104" className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white flex items-center gap-1.5 transition-colors font-bold shadow-xs">
            <PhoneCall className="w-3.5 h-3.5" /> Health Helpline: 104
          </a>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenSideMenu}
            className="p-1.5 hover:bg-slate-100 rounded transition-colors text-slate-600 mr-1"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="w-9 h-9 bg-blue-600 rounded flex items-center justify-center text-white font-bold shadow-sm">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Leo AI Chat</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <EmergencyAlertsToggle />
          
          {/* View Toggle */}
          <div className="hidden md:flex bg-slate-100 p-1 rounded border border-slate-200">
            <button
              onClick={() => setViewMode('dashboard')}
              className={`px-3 py-1 text-xs font-medium rounded transition-all ${viewMode === 'dashboard' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Home
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1 text-xs font-medium rounded transition-all ${viewMode === 'split' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Split
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-xs font-medium rounded transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'}`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1 text-xs font-medium rounded transition-all ${viewMode === 'map' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Map
            </button>
          </div>

          {/* AI Care Advisor Button */}
          <button
            onClick={onOpenAiAssistant}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Leo AI Chat</span>
          </button>

          {/* Auth Section */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={onOpenAppointments}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded border border-slate-200 transition-colors cursor-pointer"
                  title="My Appointments"
                >
                  <UserIcon className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-800">{currentUser.name}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-1.5 border border-slate-200 rounded text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5" /> Login
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Sign up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
