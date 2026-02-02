import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Leaf } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AnalysisResult, DiseaseType, getConfidenceLevel } from '@/lib/diseaseAnalyzer';
import { Language } from '@/lib/translations';

interface ChatbotProps {
  result?: AnalysisResult | null;
  isFullPage?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

interface Message {
  role: 'bot' | 'user';
  content: string;
}

const responses: Record<Language, Record<string, string[]>> = {
  en: {
    greeting: [
      "Hello! I'm your Tea-Shield assistant.",
      "I can help you understand disease detection results and provide treatment advice.",
      "Ask me anything about tea leaf diseases!",
    ],
    noResult: [
      "I notice you haven't scanned a leaf yet.",
      "Go to the Scan tab to analyze a tea leaf, then come back and I can explain the results!",
    ],
    confidence: [
      "The confidence number shows how sure the app is about the result.",
      "A higher number means the app is more certain.",
      "If the confidence is low, it's a good idea to take another photo with better lighting.",
    ],
    severity: [
      "Severity tells you how much of the leaf is affected by the disease.",
      "Low severity means only a small part is affected.",
      "High severity means a large part of the leaf has the disease.",
    ],
    redRust: [
      "Red Rust appears as reddish-brown spots on the leaves.",
      "It spreads in humid conditions.",
      "You should remove affected leaves and improve air circulation.",
      "Copper-based fungicides can help control it.",
    ],
    brownBlight: [
      "Brown Blight causes dark brown spots on leaves.",
      "It often appears during wet weather.",
      "Remove and destroy infected leaves.",
      "Avoid overhead watering to reduce spread.",
    ],
    blisterBlight: [
      "Blister Blight creates pale, whitish blisters on young leaves.",
      "It's common in cool, humid weather.",
      "Affected leaves should be removed.",
      "Fungicide sprays can help prevent spread.",
    ],
    healthy: [
      "Great news! Your leaf looks healthy.",
      "The green color and texture appear normal.",
      "Keep monitoring your plants regularly to catch any problems early.",
    ],
    uncertain: [
      "The app couldn't identify a clear disease pattern.",
      "This might happen if the image is unclear or the lighting is poor.",
      "Try taking another photo with the leaf in good light.",
      "Make sure the leaf fills most of the image.",
    ],
    action: [
      "Based on the confidence level, here's what you should do:",
      "If confidence is high, you can start treatment right away.",
      "If confidence is medium, wait 2-3 days and check again.",
      "If confidence is low, take a clearer photo or ask an expert.",
    ],
    default: [
      "I understand you have a question.",
      "Feel free to ask about the disease, confidence score, or what action to take.",
      "I'm here to help you understand the results better.",
    ],
  },
  as: {
    greeting: [
      "নমস্কাৰ! মই আপোনাৰ টি-শ্বিল্ড সহায়ক।",
      "মই ৰোগ চিনাক্তকৰণৰ ফলাফল বুজাত আৰু চিকিৎসাৰ পৰামৰ্শ দিব পাৰোঁ।",
      "চাহ পাতৰ ৰোগৰ বিষয়ে মোক যিকোনো কথা সুধক!",
    ],
    noResult: [
      "মই লক্ষ্য কৰিছোঁ যে আপুনি এতিয়াও পাত স্কেন কৰা নাই।",
      "চাহ পাত বিশ্লেষণ কৰিবলৈ স্কেন টেবলৈ যাওক, তাৰ পিছত ঘূৰি আহক আৰু মই ফলাফল বুজাই দিম!",
    ],
    confidence: [
      "আত্মবিশ্বাসৰ সংখ্যাই দেখুৱায় যে এপটো ফলাফলৰ বিষয়ে কিমান নিশ্চিত।",
      "বেছি সংখ্যা মানে এপটো বেছি নিশ্চিত।",
    ],
    severity: [
      "গুৰুত্বই কয় যে পাতৰ কিমান অংশ ৰোগত আক্ৰান্ত।",
    ],
    redRust: ["ৰঙা মামৰ পাতত ৰঙচুৱা-বাদামী দাগ হিচাপে দেখা দিয়ে।"],
    brownBlight: ["বাদামী ব্লাইটে পাতত ক'লা বাদামী দাগ সৃষ্টি কৰে।"],
    blisterBlight: ["ব্লিষ্টাৰ ব্লাইটে কোমল পাতত শেঁতা, বগা ফোঁহা সৃষ্টি কৰে।"],
    healthy: ["ভাল খবৰ! আপোনাৰ পাত স্বাস্থ্যকৰ দেখা গৈছে।"],
    uncertain: ["এপে স্পষ্ট ৰোগৰ আৰ্হি চিনাক্ত কৰিব নোৱাৰিলে।"],
    action: ["আত্মবিশ্বাসৰ স্তৰৰ ওপৰত ভিত্তি কৰি, আপুনি এইটো কৰা উচিত।"],
    default: ["মই বুজিছোঁ যে আপোনাৰ এটা প্ৰশ্ন আছে।"],
  },
  hi: {
    greeting: [
      "नमस्ते! मैं आपका टी-शील्ड सहायक हूं।",
      "मैं रोग पहचान परिणामों को समझने और उपचार सलाह देने में मदद कर सकता हूं।",
      "चाय पत्ती रोगों के बारे में मुझसे कुछ भी पूछें!",
    ],
    noResult: [
      "मैंने देखा कि आपने अभी तक पत्ती स्कैन नहीं की है।",
      "चाय पत्ती का विश्लेषण करने के लिए स्कैन टैब पर जाएं, फिर वापस आएं और मैं परिणाम समझाऊंगा!",
    ],
    confidence: [
      "विश्वास संख्या दिखाती है कि ऐप परिणाम के बारे में कितना निश्चित है।",
    ],
    severity: ["गंभीरता बताती है कि पत्ती का कितना हिस्सा रोग से प्रभावित है।"],
    redRust: ["लाल जंग पत्तियों पर लाल-भूरे धब्बों के रूप में दिखाई देता है।"],
    brownBlight: ["भूरा ब्लाइट पत्तियों पर गहरे भूरे धब्बे बनाता है।"],
    blisterBlight: ["ब्लिस्टर ब्लाइट युवा पत्तियों पर हल्के, सफेद छाले बनाता है।"],
    healthy: ["अच्छी खबर! आपकी पत्ती स्वस्थ दिखती है।"],
    uncertain: ["ऐप स्पष्ट रोग पैटर्न की पहचान नहीं कर सका।"],
    action: ["विश्वास स्तर के आधार पर, आपको यह करना चाहिए।"],
    default: ["मैं समझता हूं कि आपका एक प्रश्न है।"],
  },
};

function getResponse(lang: Language, topic: string): string {
  const topicResponses = responses[lang][topic] || responses[lang].default;
  return topicResponses.join(' ');
}

function detectTopic(input: string, disease?: DiseaseType): string {
  const lower = input.toLowerCase();
  
  if (lower.includes('confidence') || lower.includes('sure') || lower.includes('certain')) {
    return 'confidence';
  }
  if (lower.includes('severity') || lower.includes('serious') || lower.includes('bad')) {
    return 'severity';
  }
  if (lower.includes('action') || lower.includes('do') || lower.includes('what')) {
    return 'action';
  }
  if (disease && (lower.includes('disease') || lower.includes('tell') || lower.includes('explain'))) {
    return disease;
  }
  
  return disease || 'default';
}

export function Chatbot({ result, isFullPage = false, isOpen = true, onClose }: ChatbotProps) {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      if (result) {
        const diseaseExplanation = getResponse(language, result.disease);
        setMessages([
          { role: 'bot', content: getResponse(language, 'greeting') },
          { role: 'bot', content: diseaseExplanation },
          { role: 'bot', content: getResponse(language, 'action') },
        ]);
      } else {
        setMessages([
          { role: 'bot', content: getResponse(language, 'greeting') },
          { role: 'bot', content: getResponse(language, 'noResult') },
        ]);
      }
      setInitialized(true);
    }
  }, [initialized, language, result]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    setTimeout(() => {
      const topic = detectTopic(userMessage, result?.disease);
      const response = getResponse(language, topic);
      setMessages(prev => [...prev, { role: 'bot', content: response }]);
    }, 500);
  };

  if (!isOpen && !isFullPage) return null;

  const content = (
    <>
      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${isFullPage ? '' : ''}`}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 fade-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'bot' ? 'bg-primary/10' : 'bg-accent/10'
            }`}>
              {msg.role === 'bot' ? (
                <Bot className="h-4 w-4 text-primary" />
              ) : (
                <User className="h-4 w-4 text-accent" />
              )}
            </div>
            <div className={`chat-bubble ${msg.role === 'bot' ? 'chat-bubble-bot' : 'chat-bubble-user'}`}>
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={`p-4 border-t border-border ${isFullPage ? 'pb-24' : ''}`}>
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('typeMessage')}
            className="flex-1 h-12 rounded-xl bg-secondary border-0"
          />
          <Button type="submit" size="icon" className="h-12 w-12 rounded-xl hero-gradient">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </>
  );

  if (isFullPage) {
    return (
      <div className="flex flex-col h-full fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl hero-gradient flex items-center justify-center shadow-glow">
            <Bot className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold">{t('chatbotTitle')}</h2>
            <p className="text-sm text-muted-foreground">Ask me anything</p>
          </div>
        </div>
        
        <div className="flex-1 glass-card flex flex-col overflow-hidden">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm fade-in">
      <div className="fixed inset-x-0 bottom-0 h-[85vh] bg-card rounded-t-3xl shadow-elevated slide-up flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full hero-gradient flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="font-display font-semibold text-lg">{t('chatbotTitle')}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {content}
      </div>
    </div>
  );
}
