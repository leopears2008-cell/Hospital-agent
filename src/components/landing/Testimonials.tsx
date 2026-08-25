import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

export function Testimonials() {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Patient",
      text: "The AI assistant was incredibly helpful. It found a cardiologist for my mother and booked the appointment in under two minutes. Truly a lifesaver.",
      rating: 5
    },
    {
      name: "Sneha Patel",
      role: "Patient",
      text: "I love the WhatsApp reminders. The whole process from finding a doctor to getting my prescription details online is seamless and highly professional.",
      rating: 5
    },
    {
      name: "Vikram Singh",
      role: "Patient",
      text: "Very clean interface and easy to use. The doctors are top-notch and the hospital staff had all my details ready when I arrived.",
      rating: 4
    }
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-sm font-bold tracking-wider text-blue-600 uppercase mb-3">Patient Stories</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Trusted by Thousands</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <Card key={i} className="bg-white border-transparent shadow-lg shadow-gray-200/50 rounded-2xl relative">
              <Quote className="absolute top-6 right-6 w-10 h-10 text-blue-50" />
              <CardContent className="p-8 relative z-10">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`w-5 h-5 ${j < t.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-8 text-lg">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{t.name}</h4>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
