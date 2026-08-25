import { CalendarClock, FolderHeart, Search, Bot, Pill, FlaskConical, BellRing, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

export function PatientFeatures() {
  const features = [
    { name: "Appointment Management", icon: CalendarClock },
    { name: "Digital Medical Records", icon: FolderHeart },
    { name: "Doctor Discovery", icon: Search },
    { name: "AI Health Assistance", icon: Bot },
    { name: "Prescription Info", icon: Pill },
    { name: "Lab Reports", icon: FlaskConical },
    { name: "Follow-up Reminders", icon: BellRing },
    { name: "WhatsApp Notifications", icon: MessageCircle }
  ];

  return (
    <section className="py-24 bg-slate-50 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Everything You Need in One Place</h2>
          <p className="text-lg text-gray-600">
            A comprehensive digital healthcare experience designed to make managing your health effortless and secure.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, i) => (
            <Card key={i} className="bg-white border-transparent shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-gray-900">{feature.name}</h4>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
