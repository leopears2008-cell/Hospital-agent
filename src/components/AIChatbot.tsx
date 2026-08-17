import { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Stethoscope,
  MessageCircle,
  Languages
} from 'lucide-react';
import { auth } from '../lib/firebase';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type Language = {
  name: string;
  value: string;
  speechCode: string;
};

const LANGUAGES: Language[] = [
  { name: 'English', value: 'English', speechCode: 'en-IN' },
  { name: 'தமிழ்', value: 'Tamil', speechCode: 'ta-IN' },
  { name: 'हिन्दी', value: 'Hindi', speechCode: 'hi-IN' },
  { name: 'తెలుగు', value: 'Telugu', speechCode: 'te-IN' },
  { name: 'ಕನ್ನಡ', value: 'Kannada', speechCode: 'kn-IN' },
  { name: 'മലയാളം', value: 'Malayalam', speechCode: 'ml-IN' },
];

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'symptom'>('chat');

  const [messages, setMessages] = useState<
    { role: 'user' | 'ai'; text: string }[]
  >([]);

  const [symptomMessages, setSymptomMessages] = useState<
    { role: 'user' | 'ai'; text: string }[]
  >([]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);

  // 🌐 Selected language
  const [language, setLanguage] = useState<Language>(LANGUAGES[0]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages, symptomMessages, activeTab]);

  // ─────────────────────────────────────────────
  // 🌐 Multilingual welcome message
  // ─────────────────────────────────────────────

  const getWelcomeMessage = () => {
    switch (language.value) {
      case 'Tamil':
        return 'வணக்கம்! நான் உங்கள் AI சுகாதார உதவியாளர். மருத்துவமனைகள், மருத்துவர்கள், சந்திப்புகள் அல்லது பொதுவான சுகாதார தகவல்கள் குறித்து கேட்கலாம்.';

      case 'Hindi':
        return 'नमस्ते! मैं आपका AI स्वास्थ्य सहायक हूँ। आप अस्पताल, डॉक्टर, अपॉइंटमेंट या सामान्य स्वास्थ्य जानकारी के बारे में पूछ सकते हैं।';

      case 'Telugu':
        return 'నమస్కారం! నేను మీ AI ఆరోగ్య సహాయకుడిని. ఆసుపత్రులు, వైద్యులు, అపాయింట్మెంట్లు లేదా సాధారణ ఆరోగ్య సమాచారం గురించి అడగవచ్చు.';

      case 'Kannada':
        return 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ AI ಆರೋಗ್ಯ ಸಹಾಯಕ. ಆಸ್ಪತ್ರೆಗಳು, ವೈದ್ಯರು, ಅಪಾಯಿಂಟ್ಮೆಂಟ್ಗಳು ಅಥವಾ ಸಾಮಾನ್ಯ ಆರೋಗ್ಯ ಮಾಹಿತಿಯ ಬಗ್ಗೆ ಕೇಳಬಹುದು.';

      case 'Malayalam':
        return 'നമസ്കാരം! ഞാൻ നിങ്ങളുടെ AI ആരോഗ്യ സഹായി ആണ്. ആശുപത്രികൾ, ഡോക്ടർമാർ, അപ്പോയിന്റ്മെന്റുകൾ അല്ലെങ്കിൽ പൊതുവായ ആരോഗ്യ വിവരങ്ങൾ ചോദിക്കാം.';

      default:
        return 'Hi! I am your AI health assistant. I can help you find hospitals, doctors, appointments, and general health information.';
    }
  };

  // ─────────────────────────────────────────────
  // 🎙 Multilingual voice input
  // ─────────────────────────────────────────────

  const toggleListening = async () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      stream.getTracks().forEach((track) => track.stop());
    } catch (err) {
      console.warn('Microphone permission denied:', err);

      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: 'Microphone access was denied. Please allow microphone permission in your browser settings.',
        },
      ]);

      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;

    // ⭐ Important: selected language
    recognition.lang = language.speechCode;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');

      setInput(transcript);
    };

    recognition.onerror = (event: any) => {
      console.warn(
        'Speech recognition error:',
        event.error
      );

      setIsListening(false);

      if (event.error !== 'no-speech') {
        setMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            text: `Microphone error: ${event.error}`,
          },
        ]);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    recognition.start();
  };

  // ─────────────────────────────────────────────
  // 🔊 Multilingual voice output
  // ─────────────────────────────────────────────

  const speak = (text: string) => {
    if (
      !isVoiceEnabled ||
      !('speechSynthesis' in window)
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/[*#]/g, '')
      .replace(/_/g, '');

    const utterance =
      new SpeechSynthesisUtterance(cleanText);

    // ⭐ Important: selected language
    utterance.lang = language.speechCode;

    utterance.rate = 0.95;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  // ─────────────────────────────────────────────
  // ❌ Close chatbot
  // ─────────────────────────────────────────────

  const handleClose = () => {
    setIsOpen(false);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // ─────────────────────────────────────────────
  // 🌐 Change language
  // ─────────────────────────────────────────────

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selected = LANGUAGES.find(
      (item) => item.value === event.target.value
    );

    if (!selected) return;

    setLanguage(selected);

    // Stop current voice
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // Stop microphone
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setIsListening(false);
  };

  // ─────────────────────────────────────────────
  // 💬 Send message
  // ─────────────────────────────────────────────

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();

    if (activeTab === 'chat') {
      setMessages((prev) => [
        ...prev,
        {
          role: 'user',
          text: userMsg,
        },
      ]);
    } else {
      setSymptomMessages((prev) => [
        ...prev,
        {
          role: 'user',
          text: userMsg,
        },
      ]);
    }

    setInput('');
    setLoading(true);

    try {
      const firebaseUser = auth.currentUser;

      const token = firebaseUser
        ? await firebaseUser.getIdToken()
        : null;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] =
          `Bearer ${token}`;
      }

      // ─────────────────────────────────────
      // 🤖 AI Assistant
      // ─────────────────────────────────────

      if (activeTab === 'chat') {
        const languageInstruction = `
IMPORTANT:
The user selected ${language.value} as their preferred language.

Answer completely in ${language.value}.

Do not switch to English unless the user asks for English.

Use simple language that patients can understand.
Do not claim to diagnose the user.
For emergencies, recommend immediate professional medical help.
`;

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers,

          body: JSON.stringify({
            message:
              languageInstruction +
              '\n\nUser message:\n' +
              userMsg,
          }),
        });

        if (!res.ok) {
          throw new Error(
            'Failed to fetch response'
          );
        }

        const data = await res.json();

        setMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            text: data.reply,
          },
        ]);

        speak(data.reply);
      }

      // ─────────────────────────────────────
      // 🩺 Symptom Checker
      // ─────────────────────────────────────

      else {
        const languageInstruction = `
IMPORTANT:
The user selected ${language.value} as their preferred language.

Respond completely in ${language.value}.
Do not switch to English unless explicitly requested.

This is a symptom checker, not a medical diagnosis.
For serious or emergency symptoms, advise the user to seek
professional medical attention immediately.
`;

        const res = await fetch(
          '/api/symptom-checker',
          {
            method: 'POST',
            headers,

            body: JSON.stringify({
              history: symptomMessages,

              currentAnswer:
                languageInstruction +
                '\n\nUser answer:\n' +
                userMsg,
            }),
          }
        );

        if (!res.ok) {
          throw new Error(
            'Failed to fetch response'
          );
        }

        const data = await res.json();

        setSymptomMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            text: data.reply,
          },
        ]);

        speak(data.reply);
      }
    } catch (error) {
      console.error(error);

      const errorMessage =
        language.value === 'Tamil'
          ? 'மன்னிக்கவும், தற்போது AI சேவையுடன் இணைக்க முடியவில்லை.'
          : language.value === 'Hindi'
          ? 'क्षमा करें, अभी AI सेवा से कनेक्ट नहीं हो पा रहा है।'
          : language.value === 'Telugu'
          ? 'క్షమించండి, ప్రస్తుతం AI సేవకు కనెక్ట్ కాలేకపోతున్నాము.'
          : language.value === 'Kannada'
          ? 'ಕ್ಷಮಿಸಿ, ಇದೀಗ AI ಸೇವೆಗೆ ಸಂಪರ್ಕಿಸಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ.'
          : language.value === 'Malayalam'
          ? 'ക്ഷമിക്കണം, ഇപ്പോൾ AI സേവനവുമായി ബന്ധപ്പെടാൻ കഴിയുന്നില്ല.'
          : 'Sorry, I am having trouble connecting to the AI service right now.';

      if (activeTab === 'chat') {
        setMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            text: errorMessage,
          },
        ]);
      } else {
        setSymptomMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            text: errorMessage,
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // 🖥 UI
  // ─────────────────────────────────────────────

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-white text-slate-800 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 hover:bg-slate-50 transition-all z-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
          aria-label="Open AI Health Assistant"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[350px] h-[520px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col z-50 overflow-hidden sm:w-[400px]">

          {/* Header */}
          <div className="px-4 py-3 bg-white border-b border-slate-200 text-slate-800 flex justify-between items-center">

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                <Bot className="w-5 h-5 text-slate-700" />
              </div>

              <div>
                <div className="font-bold text-sm">
                  AI Health Assistant
                </div>

                <div className="text-[10px] text-green-600">
                  ● Online
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">

              {/* 🌐 Language Selector */}
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-1.5">

                <Languages className="w-3.5 h-3.5 text-slate-500" />

                <select
                  value={language.value}
                  onChange={
                    handleLanguageChange
                  }
                  className="text-xs bg-transparent border-0 px-1.5 py-1.5 focus:outline-none text-slate-700 max-w-[75px]"
                  aria-label="Select language"
                >
                  {LANGUAGES.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>

              </div>

              {/* 🔊 Voice */}
              <button
                onClick={() =>
                  setIsVoiceEnabled(
                    !isVoiceEnabled
                  )
                }
                className="p-1.5 hover:bg-slate-100 text-slate-500 rounded-md transition-colors"
                title={
                  isVoiceEnabled
                    ? 'Mute Voice'
                    : 'Enable Voice'
                }
              >
                {isVoiceEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-300" />
                )}
              </button>

              {/* ❌ Close */}
              <button
                onClick={handleClose}
                className="p-1.5 hover:bg-slate-100 text-slate-500 rounded-md transition-colors"
                aria-label="Close chatbot"
              >
                <X className="w-5 h-5" />
              </button>

            </div>
          </div>

          {/* Language indicator */}
          <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 text-[11px] text-slate-500 text-center">
            🌐 Responding in{' '}
            <strong>{language.name}</strong>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-700 bg-white">

            <button
              onClick={() =>
                setActiveTab('chat')
              }
              className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'chat'
                  ? 'text-slate-900 border-b-2 border-slate-900'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              Assistant
            </button>

            <button
              onClick={() =>
                setActiveTab('symptom')
              }
              className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'symptom'
                  ? 'text-slate-900 border-b-2 border-slate-900'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              Symptom Checker
            </button>

          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 dark:bg-slate-900/50 space-y-4">

            {/* Welcome */}
            {activeTab === 'chat' && (
              <div className="flex space-x-2">

                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-slate-700" />
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-2.5 text-sm text-slate-800 shadow-sm">
                  {getWelcomeMessage()}
                </div>

              </div>
            )}

            {/* Symptom initial message */}
            {activeTab === 'symptom' &&
              symptomMessages.length === 0 && (
                <div className="flex space-x-2">

                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                    <Stethoscope className="w-4 h-4 text-slate-700" />
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-2.5 text-sm text-slate-800 shadow-sm">
                    {language.value === 'Tamil'
                      ? 'உங்கள் அறிகுறிகளை சில வார்த்தைகளில் விவரிக்கவும்.'
                      : language.value === 'Hindi'
                      ? 'कृपया अपने लक्षणों का कुछ शब्दों में वर्णन करें।'
                      : 'Please describe the symptoms you are experiencing today in a few words.'}
                  </div>

                </div>
              )}

            {/* Messages */}
            {(activeTab === 'chat'
              ? messages
              : symptomMessages
            ).map((msg, i) => (
              <div
                key={i}
                className={`flex space-x-2 ${
                  msg.role === 'user'
                    ? 'flex-row-reverse space-x-reverse'
                    : ''
                }`}
              >

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-slate-800'
                      : 'bg-slate-200'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-slate-700" />
                  )}
                </div>

                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm max-w-[80%] whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-slate-800 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>

              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="flex space-x-2">

                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-slate-700" />
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 flex items-center space-x-1 shadow-sm">

                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />

                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75" />

                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150" />

                </div>

              </div>
            )}

            <div ref={messagesEndRef} />

          </div>

          {/* Input */}
          <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center space-x-2"
            >

              {/* 🎙 Microphone */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2 rounded-xl transition-colors ${
                  isListening
                    ? 'bg-rose-100 text-rose-600 hover:bg-rose-200 animate-pulse'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                title={`Speak in ${language.name}`}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>

              {/* Input */}
              <input
                type="text"
                value={input}
                onChange={(e) =>
                  setInput(e.target.value)
                }
                placeholder={
                  isListening
                    ? `Listening in ${language.name}...`
                    : language.value === 'Tamil'
                    ? 'உங்கள் கேள்வியை எழுதுங்கள்...'
                    : language.value === 'Hindi'
                    ? 'अपना प्रश्न लिखें...'
                    : language.value === 'Telugu'
                    ? 'మీ ప్రశ్నను టైప్ చేయండి...'
                    : 'Type your message...'
                }
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
              />

              {/* Send */}
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2 bg-slate-800 text-white rounded-xl hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>

            </form>

            <div className="text-[9px] text-slate-400 text-center mt-2">
              AI responses are for general information only and are not a medical diagnosis.
            </div>

          </div>

        </div>
      )}
    </>
  );
}
