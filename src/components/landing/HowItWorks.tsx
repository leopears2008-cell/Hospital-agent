export function HowItWorks() {
  const steps = [
    { num: "01", title: "Tell us what you need", desc: "Describe your symptoms or select a specific specialty or doctor." },
    { num: "02", title: "AI finds the right option", desc: "Our intelligent system matches you with the best available specialists." },
    { num: "03", title: "Book your appointment", desc: "Choose a convenient time slot and confirm your visit instantly." },
    { num: "04", title: "Receive reminders & support", desc: "Get WhatsApp notifications, preparation guidelines, and seamless follow-ups." }
  ];

  return (
    <section className="py-24 bg-white border-y border-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-sm font-bold tracking-wider text-blue-600 uppercase mb-3">Simple Process</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">How It Works</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative group">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gray-100 group-hover:bg-blue-100 transition-colors z-0"></div>
              )}
              
              <div className="relative z-10 bg-white pr-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-black mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                  {step.num}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h4>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
