import { Building2, HeartPulse } from 'lucide-react';

export function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="relative">
            <div className="rounded-[2rem] overflow-hidden shadow-2xl relative z-10">
              <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop" alt="Hospital Building" className="w-full h-auto object-cover aspect-video lg:aspect-square" />
            </div>
            {/* Decorative block */}
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-blue-50 rounded-[2rem] -z-0"></div>
          </div>

          <div>
            <h2 className="text-sm font-bold tracking-wider text-blue-600 uppercase mb-3">About Us</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Pioneering the Future of Healthcare</h3>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Hospital AI is a cutting-edge healthcare platform dedicated to bridging the gap between patients and medical professionals. We leverage advanced artificial intelligence to streamline hospital navigation, appointment booking, and access to general healthcare information.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our mission is to empower patients with instant access to the care they need, while ensuring their data remains secure, and their experience is as seamless as possible.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">State of the Art</h4>
                  <p className="text-sm text-gray-600">Modern infrastructure paired with advanced digital tools.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
                  <HeartPulse className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Patient First</h4>
                  <p className="text-sm text-gray-600">Every feature is designed around the patient experience.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
