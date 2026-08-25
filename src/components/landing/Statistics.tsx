export function Statistics() {
  const stats = [
    { value: "50K+", label: "Patients Supported" },
    { value: "100+", label: "Doctors" },
    { value: "25+", label: "Specialties" },
    { value: "24/7", label: "AI Assistance" }
  ];

  return (
    <section className="py-20 bg-blue-600 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center divide-x divide-white/20">
          {stats.map((stat, i) => (
            <div key={i} className={`flex flex-col ${i % 2 !== 0 ? 'border-l border-white/20' : i === 0 ? 'border-none' : ''}`}>
              <span className="text-4xl md:text-5xl lg:text-6xl font-black mb-2">{stat.value}</span>
              <span className="text-blue-100 font-medium tracking-wide uppercase text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
