import { ArrowRight, ShieldCheck, Calendar, MessageSquareText } from 'lucide-react';
import { Button } from '../ui/button';

export function Hero() {
  return (
    <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-100/50 blur-3xl opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-sky-100/50 blur-3xl opacity-60"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-700">
              <ShieldCheck className="w-4 h-4" />
              <span>24/7 AI Assistance • Secure Patient Support • Easy Appointments</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100 text-balance">
              Your Health.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">
                Our Care.
              </span><br />
              Powered by AI.
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 text-balance">
              Connect with leading doctors, book appointments effortlessly, manage your visits securely, and get instant assistance from our intelligent hospital assistant — anytime, anywhere.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-7 duration-700 delay-300">
              <Button className="h-14 px-8 text-base bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-600/20 transition-all hover:scale-105">
                Book an Appointment
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" className="h-14 px-8 text-base bg-white border-gray-200 hover:bg-gray-50 text-gray-800 rounded-full shadow-sm transition-all hover:scale-105">
                Talk to AI Assistant
                <MessageSquareText className="w-5 h-5 ml-2 text-blue-600" />
              </Button>
            </div>
          </div>

          <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-300 lg:pl-10">
            {/* Main Image Frame */}
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] md:aspect-square lg:aspect-[4/5] bg-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1000&auto=format&fit=crop" 
                alt="Professional female doctor smiling" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>

            {/* Floating Card 1: AI Assistant */}
            <div className="absolute top-10 -left-6 md:-left-12 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 flex gap-4 items-center animate-bounce duration-3000 delay-500" style={{ animationDuration: '4s' }}>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <MessageSquareText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">AI Assistant</p>
                <p className="text-xs text-gray-500">Online & Ready</p>
              </div>
            </div>

            {/* Floating Card 2: Appointments */}
            <div className="absolute bottom-12 -right-4 md:-right-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 flex gap-4 items-center animate-bounce duration-3000 delay-1000" style={{ animationDuration: '5s' }}>
              <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Appointments</p>
                <p className="text-xs text-gray-500">2 slots today</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
