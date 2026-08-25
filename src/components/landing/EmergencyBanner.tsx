import { Siren, PhoneCall } from 'lucide-react';
import { Button } from '../ui/button';

export function EmergencyBanner() {
  return (
    <section className="bg-red-600 text-white py-12 relative overflow-hidden">
      <div className="absolute right-0 top-0 w-64 h-64 bg-red-500 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-red-700/50 backdrop-blur-sm rounded-[2rem] p-8 md:p-12 border border-red-500/50">
          
          <div className="flex items-start gap-6 max-w-2xl">
            <div className="w-16 h-16 rounded-full bg-white text-red-600 flex items-center justify-center shrink-0 shadow-lg shadow-black/10 animate-pulse">
              <Siren className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Need Immediate Medical Help?</h2>
              <p className="text-red-100 text-lg leading-relaxed">
                For life-threatening emergencies, contact your local emergency services immediately. Do not rely on the AI assistant for emergency medical advice.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto mt-6 md:mt-0">
            <Button size="lg" className="bg-white hover:bg-gray-100 text-red-600 rounded-full h-14 px-8 text-base font-bold shadow-lg shadow-black/10">
              <PhoneCall className="w-5 h-5 mr-2" />
              Call Ambulance (108)
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-red-500 hover:text-white rounded-full h-14 px-8 text-base">
              Hospital Contact
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}
