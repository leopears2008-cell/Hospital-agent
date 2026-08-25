import { Calendar, User, Phone, Mail, Clock, FileText, ShieldCheck, Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

export function AppointmentBooking() {
  return (
    <section id="appointments" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="order-2 lg:order-1">
            <Card className="border-gray-100 shadow-2xl shadow-blue-900/5 rounded-[2rem] overflow-hidden">
              <div className="bg-blue-600 p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Book an Appointment</h3>
                <p className="text-blue-100">Fill out the form below and we'll confirm your visit.</p>
              </div>
              <CardContent className="p-8">
                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Patient Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input id="name" placeholder="John Doe" className="pl-9 bg-gray-50 border-gray-200" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input id="phone" placeholder="+91 98765 43210" className="pl-9 bg-gray-50 border-gray-200" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input id="email" type="email" placeholder="john@example.com" className="pl-9 bg-gray-50 border-gray-200" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Select>
                        <SelectTrigger className="bg-gray-50 border-gray-200">
                          <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cardiology">Cardiology</SelectItem>
                          <SelectItem value="neurology">Neurology</SelectItem>
                          <SelectItem value="orthopedics">Orthopedics</SelectItem>
                          <SelectItem value="pediatrics">Pediatrics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Doctor (Optional)</Label>
                      <Select>
                        <SelectTrigger className="bg-gray-50 border-gray-200">
                          <SelectValue placeholder="Any Available Doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sarah">Dr. Sarah Jenkins</SelectItem>
                          <SelectItem value="michael">Dr. Michael Chen</SelectItem>
                          <SelectItem value="priya">Dr. Priya Sharma</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                        <Input id="date" type="date" className="pl-9 bg-gray-50 border-gray-200 text-gray-600" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Preferred Time</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                        <Input id="time" type="time" className="pl-9 bg-gray-50 border-gray-200 text-gray-600" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Visit</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Textarea id="reason" placeholder="Briefly describe your symptoms..." className="pl-9 min-h-[100px] bg-gray-50 border-gray-200" />
                    </div>
                  </div>

                  <Button type="button" className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 text-white rounded-xl mt-4">
                    Confirm Appointment
                  </Button>
                  
                  <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    Your appointment details are securely protected.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Seamless Appointments, <br />
              <span className="text-blue-600">Zero Hassle.</span>
            </h2>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              We've redesigned the appointment booking experience. Choose your preferred doctor, select a time that works for you, and receive instant confirmation via email and WhatsApp.
            </p>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Real-time Availability</h4>
                  <p className="text-gray-600">See live schedules of all our specialists and pick a slot instantly without making a phone call.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
                  <Bell className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Smart Reminders</h4>
                  <p className="text-gray-600">Receive automated reminders on WhatsApp and Email so you never miss a visit.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}


