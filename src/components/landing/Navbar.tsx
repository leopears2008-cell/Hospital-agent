import { useState, useEffect } from 'react';
import { Stethoscope, Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signInWithGoogle, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Doctors', href: '#doctors' },
    { name: 'Appointments', href: '#appointments' },
    { name: 'AI Assistant', href: '#ai-assistant' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 group">
            <div className="bg-blue-600 text-white p-2 rounded-xl group-hover:bg-blue-700 transition-colors">
              <Stethoscope className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Hospital<span className="text-blue-600">AI</span></span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full border border-gray-200" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {user.email?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700 hidden xl:block">{user.displayName || 'Patient'}</span>
                  </div>
                  <Button variant="ghost" onClick={logout} className="text-gray-700 hover:text-red-600 hover:bg-red-50 p-2">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" onClick={signInWithGoogle} className="text-gray-700 font-medium hidden xl:flex gap-2 hover:bg-blue-50 hover:text-blue-600">
                  <User className="w-4 h-4" />
                  Patient Login
                </Button>
              )}
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-md hover:shadow-lg transition-all">
                Book Appointment
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl py-4 px-4 flex flex-col gap-4 animate-in slide-in-from-top-4">
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a 
                  href={link.href} 
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
            {user ? (
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-gray-900">{user.displayName || 'Patient'}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-red-600 hover:bg-red-50">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={() => { signInWithGoogle(); setIsMobileMenuOpen(false); }} className="w-full justify-center gap-2 h-12 text-base hover:bg-blue-50 hover:text-blue-600 border-gray-200">
                <User className="w-4 h-4" />
                Patient Login
              </Button>
            )}
            <Button className="w-full justify-center bg-blue-600 hover:bg-blue-700 h-12 text-base rounded-xl shadow-md">
              Book Appointment
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
