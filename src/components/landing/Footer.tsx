import { Stethoscope, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="space-y-6">
            <a href="#" className="flex items-center gap-2 group inline-flex">
              <div className="bg-blue-600 text-white p-2 rounded-xl">
                <Stethoscope className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Hospital<span className="text-blue-500">AI</span></span>
            </a>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Transforming the healthcare experience with intelligent technology, making quality care more accessible and efficient for everyone.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-4">
              <li><a href="#home" className="hover:text-blue-400 transition-colors">Home</a></li>
              <li><a href="#services" className="hover:text-blue-400 transition-colors">Services</a></li>
              <li><a href="#doctors" className="hover:text-blue-400 transition-colors">Find a Doctor</a></li>
              <li><a href="#appointments" className="hover:text-blue-400 transition-colors">Book Appointment</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Features</h4>
            <ul className="space-y-4">
              <li><a href="#ai-assistant" className="hover:text-blue-400 transition-colors">AI Health Assistant</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Patient Portal</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Digital Records</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Language Support</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <span>+91 1800 123 4567<br/><span className="text-sm text-slate-500">24/7 Toll Free</span></span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <span>support@hospitalai.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <span>123 Health Avenue, Medical District,<br/>Chennai, Tamil Nadu 600001</span>
              </li>
            </ul>
          </div>
          
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>© {new Date().getFullYear()} Hospital AI Agent. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
