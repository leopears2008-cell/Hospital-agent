import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export function FAQ() {
  const faqs = [
    {
      q: "How does the AI assistant work?",
      a: "Our AI assistant uses advanced language models to understand your natural queries. It can search our doctor database, check real-time availability, help book appointments, and answer general hospital-related questions instantly."
    },
    {
      q: "Can I book an appointment through AI?",
      a: "Yes! You can simply tell the AI what you need (e.g., 'I need a cardiologist tomorrow morning'), and it will guide you through selecting a doctor, choosing a time slot, and confirming the booking."
    },
    {
      q: "Can I reschedule my appointment?",
      a: "Absolutely. You can log into your patient dashboard or ask the AI assistant to help you reschedule or cancel your upcoming appointments."
    },
    {
      q: "Does the AI provide medical diagnosis?",
      a: "No. The AI assistant is designed for navigation, booking, and general hospital information. It does not provide medical diagnoses or treatment plans. Always consult with a qualified doctor for medical advice."
    },
    {
      q: "Which languages are supported?",
      a: "Currently, our AI assistant supports English, Hindi, Tamil, Telugu, Malayalam, and Kannada to ensure accessible healthcare for everyone."
    },
    {
      q: "How are my patient details protected?",
      a: "We use enterprise-grade encryption and comply with all healthcare data privacy regulations. Your data is stored securely and is only accessible by you and your authorized healthcare providers."
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-wider text-blue-600 uppercase mb-3">Support</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
        </div>

        <Accordion className="w-full space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border border-gray-100 bg-gray-50/50 rounded-2xl px-6 data-[state=open]:bg-white data-[state=open]:shadow-md transition-all">
              <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:no-underline py-6">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-base leading-relaxed pb-6">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
