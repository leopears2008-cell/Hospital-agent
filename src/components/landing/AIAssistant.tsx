import { MessageSquareText, CalendarCheck, Search, FileText, Bot } from 'lucide-react';
import { Button } from '../ui/button';

export function AIAssistant() {
  const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada'];

  return (
    <section id="ai-assistant" className="py-24 bg-slate-900 text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-sky-500/20 blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-medium">
              <Bot className="w-4 h-4" />
              <span>Smart Healthcare Companion</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Meet Your 24/7 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">
                Hospital AI Assistant
              </span>
            </h2>
            
            <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-xl">
              Skip the waitlines. Our intelligent assistant helps you find doctors, book appointments, check hospital info, and answers your non-emergency healthcare queries instantly.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Button variant="outline" className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-slate-200 rounded-full">
                <CalendarCheck className="w-4 h-4 mr-2 text-blue-400" /> Book Appointment
              </Button>
              <Button variant="outline" className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-slate-200 rounded-full">
                <Search className="w-4 h-4 mr-2 text-blue-400" /> Find Doctor
              </Button>
              <Button variant="outline" className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-slate-200 rounded-full">
                <CalendarCheck className="w-4 h-4 mr-2 text-sky-400" /> Reschedule
              </Button>
              <Button variant="outline" className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-slate-200 rounded-full">
                <FileText className="w-4 h-4 mr-2 text-sky-400" /> Hospital Info
              </Button>
            </div>

            <div>
              <p className="text-sm text-slate-400 font-medium mb-3 uppercase tracking-wider">Speaks Your Language</p>
              <div className="flex flex-wrap gap-2">
                {languages.map(lang => (
                  <span key={lang} className="px-3 py-1 rounded-md bg-slate-800 text-slate-300 text-sm font-medium border border-slate-700/50">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-[2rem] p-6 shadow-2xl overflow-hidden">
              {/* Chat Header */}
              <div className="flex items-center gap-4 pb-6 border-b border-slate-700/50 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center shadow-lg">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Hospital Assistant</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-sm text-slate-400">Online 24/7</span>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="space-y-6 mb-6">
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-sm max-w-[85%] shadow-md">
                    <p>I need a cardiologist appointment tomorrow.</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-1 border border-blue-500/30">
                    <Bot className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="bg-slate-700/50 border border-slate-600/50 text-slate-200 p-4 rounded-2xl rounded-tl-sm max-w-[85%]">
                    <p className="mb-3">Sure. I found 2 available cardiology appointments for tomorrow with Dr. Sarah Jenkins.</p>
                    <p className="font-medium text-white mb-2">Would you prefer morning or afternoon?</p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4">Morning</Button>
                      <Button size="sm" variant="secondary" className="bg-slate-600 hover:bg-slate-500 text-white rounded-lg px-4">Afternoon</Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Input Box */}
              <div className="relative mt-4">
                <input 
                  type="text" 
                  placeholder="Type your message..." 
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-4 pl-4 pr-12 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  readOnly
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <MessageSquareText className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
            
            {/* Decorative elements around phone/chat */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-500 to-sky-400 rounded-full blur-2xl opacity-40"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-indigo-500 to-purple-400 rounded-full blur-2xl opacity-30"></div>
          </div>

        </div>
      </div>
    </section>
  );
}
