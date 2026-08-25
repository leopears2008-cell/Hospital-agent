import { HeartPulse, Brain, Bone, Baby, Users, Microscope, Siren, ArrowRight, Stethoscope } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

export function Services() {
  const services = [
    { name: "Cardiology", desc: "Expert heart care and vascular treatments.", icon: HeartPulse },
    { name: "Neurology", desc: "Advanced care for brain and nervous system.", icon: Brain },
    { name: "Orthopedics", desc: "Comprehensive bone, joint, and muscle care.", icon: Bone },
    { name: "Pediatrics", desc: "Specialized healthcare for infants and children.", icon: Baby },
    { name: "General Medicine", desc: "Primary care and preventive health services.", icon: Users },
    { name: "Dermatology", desc: "Advanced skin, hair, and nail treatments.", icon: Stethoscope },
    { name: "Diagnostics", desc: "State-of-the-art imaging and laboratory tests.", icon: Microscope },
    { name: "Emergency Care", desc: "24/7 immediate care for critical conditions.", icon: Siren, isEmergency: true }
  ];

  return (
    <section id="services" className="py-24 bg-white relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-40 right-0 w-[800px] h-[800px] bg-sky-50 rounded-full blur-3xl opacity-50 -z-10 translate-x-1/2"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-sm font-bold tracking-wider text-blue-600 uppercase mb-3">Departments</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Healthcare Designed Around You</h3>
          <p className="text-lg text-gray-600">
            From routine checkups to specialized treatments, our world-class departments offer comprehensive care tailored to your unique needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 rounded-2xl border-gray-100 ${service.isEmergency ? 'border-red-100 hover:border-red-200 bg-red-50/30' : 'hover:border-blue-200 bg-white'}`}>
              <CardContent className="p-8">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${service.isEmergency ? 'bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'} transition-colors duration-300`}>
                  <service.icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{service.name}</h4>
                <p className="text-gray-500 mb-6 leading-relaxed">{service.desc}</p>
                <Button variant="ghost" className={`p-0 h-auto hover:bg-transparent ${service.isEmergency ? 'text-red-600 hover:text-red-700' : 'text-blue-600 hover:text-blue-700'} font-semibold gap-2`}>
                  Explore <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
