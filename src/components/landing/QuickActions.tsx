import { CalendarCheck, MessageSquareHeart, Stethoscope, PhoneCall } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

export function QuickActions() {
  const actions = [
    {
      title: "Book Appointment",
      description: "Find a doctor and schedule your visit.",
      icon: CalendarCheck,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      hoverColor: "group-hover:bg-blue-600 group-hover:text-white"
    },
    {
      title: "AI Health Assistant",
      description: "Get instant answers to common healthcare questions.",
      icon: MessageSquareHeart,
      color: "text-sky-500",
      bgColor: "bg-sky-50",
      hoverColor: "group-hover:bg-sky-500 group-hover:text-white"
    },
    {
      title: "Find a Doctor",
      description: "Explore doctors by specialty and availability.",
      icon: Stethoscope,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      hoverColor: "group-hover:bg-indigo-600 group-hover:text-white"
    },
    {
      title: "Emergency Support",
      description: "Quickly access emergency information and contacts.",
      icon: PhoneCall,
      color: "text-red-600",
      bgColor: "bg-red-50",
      hoverColor: "group-hover:bg-red-600 group-hover:text-white"
    }
  ];

  return (
    <section className="relative -mt-10 z-20 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map((action, index) => (
            <Card key={index} className="group cursor-pointer border-none shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${action.bgColor} ${action.color} ${action.hoverColor}`}>
                  <action.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
