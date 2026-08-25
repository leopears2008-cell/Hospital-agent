import { Shield, Lock, Users, Key, EyeOff } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

export function Security() {
  const securityFeatures = [
    { title: "Secure Authentication", icon: Lock, desc: "End-to-end encrypted login and role-based access for patients and staff." },
    { title: "Protected Records", icon: Shield, desc: "All patient information is stored securely in compliant cloud databases." },
    { title: "Role-Based Access", icon: Users, desc: "Strict permission controls ensure only authorized doctors access your records." },
    { title: "Privacy Focused", icon: EyeOff, desc: "Your data is never shared with third parties without explicit consent." }
  ];

  return (
    <section className="py-24 bg-slate-900 text-white relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium border border-blue-500/30">
            <Key className="w-4 h-4" />
            <span>Enterprise-Grade Security</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold mb-6">Your Data is Safe with Us</h3>
          <p className="text-lg text-slate-400">
            We prioritize your privacy and data security above all else. Our platform is built on modern security standards to protect your medical information.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityFeatures.map((feature, i) => (
            <Card key={i} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 transition-colors">
              <CardContent className="p-6">
                <feature.icon className="w-8 h-8 text-blue-400 mb-4" />
                <h4 className="font-bold text-lg text-white mb-2">{feature.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
