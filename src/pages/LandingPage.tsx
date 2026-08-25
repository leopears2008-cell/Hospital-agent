import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { QuickActions } from '../components/landing/QuickActions';
import { Services } from '../components/landing/Services';
import { AIAssistant } from '../components/landing/AIAssistant';
import { Doctors } from '../components/landing/Doctors';
import { AppointmentBooking } from '../components/landing/AppointmentBooking';
import { PatientFeatures } from '../components/landing/PatientFeatures';
import { HowItWorks } from '../components/landing/HowItWorks';
import { Statistics } from '../components/landing/Statistics';
import { Testimonials } from '../components/landing/Testimonials';
import { EmergencyBanner } from '../components/landing/EmergencyBanner';
import { FAQ } from '../components/landing/FAQ';
import { About } from '../components/landing/About';
import { Security } from '../components/landing/Security';
import { Footer } from '../components/landing/Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-200">
      <Navbar />
      <main>
        <Hero />
        <QuickActions />
        <Services />
        <AIAssistant />
        <Doctors />
        <AppointmentBooking />
        <PatientFeatures />
        <HowItWorks />
        <Statistics />
        <Testimonials />
        <About />
        <Security />
        <FAQ />
        <EmergencyBanner />
      </main>
      <Footer />
    </div>
  );
}
