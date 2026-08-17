import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Mic, MicOff, Volume2, VolumeX, Stethoscope, MessageCircle } from 'lucide-react';
import { auth } from '../lib/firebase';

// Add type support for window
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'symptom'>('chat');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [symptomMessages, setSymptomMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Welcome to the Symptom Checker. Please describe the symptoms you are experiencing today in a few words." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, symptomMessages, activeTab]);

  const toggleListening = async () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      // Force the browser to prompt for microphone permission first
      // This is often required in iframes before SpeechRecognition will work
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately since we only wanted to trigger the permission prompt
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.warn("Microphone permission denied:", err);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: "Microphone access was denied. If you are viewing this in the AI Studio preview window, please click the 'Open in new tab' button (top right) to allow microphone permissions. Otherwise, check your browser settings."
      }]);
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

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
      console.warn("Speech recognition error:", event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: "Microphone access was denied. If you are viewing this in the AI Studio preview window, please click the 'Open in new tab' button (top right) to allow microphone permissions. Otherwise, check your browser settings."
        }]);
      } else if (event.error !== 'no-speech') {
        setMessages(prev => [...prev, { role: 'ai', text: `Microphone error: ${event.error}` }]);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const speak = (text: string) => {
    if (!isVoiceEnabled || !('speechSynthesis' in window)) return;
    
    // Stop any current speech before starting new one
    window.speechSynthesis.cancel();
    
    // Clean up markdown formatting so it sounds natural
    const cleanText = text.replace(/[*#]/g, '').replace(/_/g, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-IN'; // Indian English sounds more natural for local context
    window.speechSynthesis.speak(utterance);
  };

  const handleClose = () => {
    setIsOpen(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    if (activeTab === 'chat') {
      setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    } else {
      setSymptomMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    }
    
    setInput('');
    setLoading(true);
    
    try {
      const firebaseUser = auth.currentUser;
      const token = firebaseUser ? await firebaseUser.getIdToken() : null;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      if (activeTab === 'chat') {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers,
          body: JSON.stringify({ message: userMsg })
        });
        
        if (res.ok) {
          const data = await res.json();
          setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
          speak(data.reply);
        } else {
          throw new Error('Failed to fetch response');
        }
      } else {
        const res = await fetch('/api/symptom-checker', {
          method: 'POST',
          headers,
          body: JSON.stringify({ history: symptomMessages, currentAnswer: userMsg })
        });
        
        if (res.ok) {
          const data = await res.json();
          setSymptomMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
          speak(data.reply);
        } else {
          throw new Error('Failed to fetch response');
        }
      }
    } catch (error) {
      console.error(error);
      if (activeTab === 'chat') {
        setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I'm having trouble connecting right now." }]);
      } else {
        setSymptomMessages(prev => [...prev, { role: 'ai', text: "Sorry, I'm having trouble connecting right now." }]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-white text-slate-800 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 hover:bg-slate-50 transition-all z-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[350px] h-[500px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col z-50 overflow-hidden sm:w-[400px]">
          {/* Header */}
          <div className="px-4 py-3 bg-white border-b border-slate-200 text-slate-800 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-slate-700" />
              <span className="font-bold">AI Suite</span>
            </div>
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => setIsVoiceEnabled(!isVoiceEnabled)} 
                className="p-1 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-md transition-colors"
                title={isVoiceEnabled ? "Mute Voice" : "Enable Voice"}
              >
                {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-300" />}
              </button>
              <button onClick={handleClose} className="p-1 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-md transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-700 bg-white">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'chat' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
            >
              <MessageCircle className="w-4 h-4" /> Assistant
            </button>
            <button
              onClick={() => setActiveTab('symptom')}
              className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'symptom' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
            >
              <Stethoscope className="w-4 h-4" /> Symptom Checker
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 dark:bg-slate-900/50 space-y-4">
            {activeTab === 'chat' && (
              <div className="flex space-x-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-slate-700" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-2.5 text-sm text-slate-800 shadow-sm">
                  Hi! I'm your AI assistant. How can I help you today? I can help you find a doctor, check availability, or answer general health FAQs.
                </div>
              </div>
            )}
            
            {(activeTab === 'chat' ? messages : symptomMessages).map((msg, i) => (
              <div key={i} className={`flex space-x-2 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-slate-800' : 'bg-slate-200'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-white dark:text-slate-300" /> : <Bot className="w-4 h-4 text-slate-700" />}
                </div>
                <div className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm max-w-[80%] ${
                  msg.role === 'user' 
                    ? 'bg-slate-800 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
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
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center space-x-2">
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2 rounded-xl transition-colors ${
                  isListening 
                    ? 'bg-rose-100 text-rose-600 hover:bg-rose-200 animate-pulse' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                }`}
                title="Use microphone"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput((e.target as HTMLInputElement).value)}
                placeholder={isListening ? "Listening..." : "Type your message..."}
                className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-sm"
              />
              <button 
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2 bg-slate-800 text-white rounded-xl hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
