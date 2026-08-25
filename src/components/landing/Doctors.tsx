import { useState } from 'react';
import { Star, Clock, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

export function Doctors() {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine'];

  const doctors = [
    { name: "Dr. Sarah Jenkins", specialty: "Cardiology", exp: "15 Years", rating: 4.9, time: "Tomorrow, 10:00 AM", img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&h=500&fit=crop" },
    { name: "Dr. Michael Chen", specialty: "Neurology", exp: "12 Years", rating: 4.8, time: "Today, 4:30 PM", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&h=500&fit=crop" },
    { name: "Dr. Priya Sharma", specialty: "Pediatrics", exp: "10 Years", rating: 4.9, time: "Wed, 09:15 AM", img: "https://images.unsplash.com/photo-1594824436998-dd40e4fcbe04?w=500&h=500&fit=crop" },
    { name: "Dr. James Wilson", specialty: "Orthopedics", exp: "20 Years", rating: 4.7, time: "Thu, 11:00 AM", img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&h=500&fit=crop" }
  ];

  const filteredDoctors = activeFilter === 'All' ? doctors : doctors.filter(d => d.specialty === activeFilter);

  return (
    <section id="doctors" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold tracking-wider text-blue-600 uppercase mb-3">Our Specialists</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Top Doctors</h3>
            <p className="text-gray-600 text-lg">Book appointments with highly qualified and experienced healthcare professionals.</p>
          </div>
          <Button variant="outline" className="shrink-0">View All Doctors</Button>
        </div>

        {/* Filters */}
        <div className="flex overflow-x-auto pb-4 mb-8 hide-scrollbar gap-2">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeFilter === filter ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200'}`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Doctor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDoctors.map((doc, i) => (
            <Card key={i} className="group overflow-hidden border-transparent shadow-lg shadow-gray-200/50 hover:shadow-xl transition-all duration-300 rounded-2xl bg-white">
              <div className="h-64 overflow-hidden relative">
                <img src={doc.img} alt={doc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 text-sm font-bold text-gray-900 shadow-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {doc.rating}
                </div>
              </div>
              <CardContent className="p-6">
                <div className="text-blue-600 font-medium text-sm mb-2">{doc.specialty}</div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">{doc.name}</h4>
                <p className="text-gray-500 text-sm mb-4">{doc.exp} Experience</p>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl mb-6">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">Next:</span> {doc.time}
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 border-gray-200 hover:bg-gray-50">Profile</Button>
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Book</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
