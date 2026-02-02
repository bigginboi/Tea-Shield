import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AnalysisResult, DiseaseType, getConfidenceLevel } from '@/lib/diseaseAnalyzer';
import { Language } from '@/lib/translations';

interface ChatbotProps {
  result: AnalysisResult;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'bot' | 'user';
  content: string;
}

// Simple response templates for each language
const responses: Record<Language, Record<string, string[]>> = {
  en: {
    greeting: [
      "Hello! I'm here to help you understand your leaf analysis results.",
      "Let me explain what the app found step by step.",
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
      "নমস্কাৰ! মই আপোনাৰ পাতৰ বিশ্লেষণৰ ফলাফল বুজাত সহায় কৰিবলৈ ইয়াত আছোঁ।",
      "এপে কি পাইছে সেয়া মই পদক্ষেপে পদক্ষেপে বুজাই দিওঁ।",
    ],
    confidence: [
      "আত্মবিশ্বাসৰ সংখ্যাই দেখুৱায় যে এপটো ফলাফলৰ বিষয়ে কিমান নিশ্চিত।",
      "বেছি সংখ্যা মানে এপটো বেছি নিশ্চিত।",
      "যদি আত্মবিশ্বাস কম হয়, ভাল পোহৰত আন এখন ফটো তোলাটো ভাল।",
    ],
    severity: [
      "গুৰুত্বই কয় যে পাতৰ কিমান অংশ ৰোগত আক্ৰান্ত।",
      "কম গুৰুত্ব মানে সৰু অংশ আক্ৰান্ত।",
      "বেছি গুৰুত্ব মানে পাতৰ ডাঙৰ অংশত ৰোগ আছে।",
    ],
    redRust: [
      "ৰঙা মামৰ পাতত ৰঙচুৱা-বাদামী দাগ হিচাপে দেখা দিয়ে।",
      "ই আৰ্দ্ৰ পৰিস্থিতিত বিয়পে।",
      "আক্ৰান্ত পাত আঁতৰাই বায়ু চলাচল উন্নত কৰক।",
    ],
    brownBlight: [
      "বাদামী ব্লাইটে পাতত ক'লা বাদামী দাগ সৃষ্টি কৰে।",
      "ই প্ৰায়ে তিতা বতৰত দেখা দিয়ে।",
      "সংক্ৰমিত পাত আঁতৰাই নষ্ট কৰক।",
    ],
    blisterBlight: [
      "ব্লিষ্টাৰ ব্লাইটে কোমল পাতত শেঁতা, বগা ফোঁহা সৃষ্টি কৰে।",
      "ই শীতল, আৰ্দ্ৰ বতৰত সাধাৰণ।",
      "আক্ৰান্ত পাত আঁতৰাব লাগে।",
    ],
    healthy: [
      "ভাল খবৰ! আপোনাৰ পাত স্বাস্থ্যকৰ দেখা গৈছে।",
      "সেউজীয়া ৰং আৰু গঠন স্বাভাৱিক দেখা গৈছে।",
    ],
    uncertain: [
      "এপে স্পষ্ট ৰোগৰ আৰ্হি চিনাক্ত কৰিব নোৱাৰিলে।",
      "ভাল পোহৰত আন এখন ফটো তুলিবলৈ চেষ্টা কৰক।",
    ],
    action: [
      "আত্মবিশ্বাসৰ স্তৰৰ ওপৰত ভিত্তি কৰি, আপুনি এইটো কৰা উচিত:",
      "যদি আত্মবিশ্বাস বেছি, তৎক্ষণাত চিকিৎসা আৰম্ভ কৰিব পাৰে।",
      "যদি আত্মবিশ্বাস মধ্যম, ২-৩ দিন অপেক্ষা কৰি পুনৰ পৰীক্ষা কৰক।",
    ],
    default: [
      "মই বুজিছোঁ যে আপোনাৰ এটা প্ৰশ্ন আছে।",
      "ৰোগ, আত্মবিশ্বাসৰ স্কোৰ, বা কি কৰিব লাগে সেই বিষয়ে সুধিব পাৰে।",
    ],
  },
  hi: {
    greeting: [
      "नमस्ते! मैं आपके पत्ती विश्लेषण के परिणाम समझने में मदद करने के लिए यहां हूं।",
      "ऐप ने क्या पाया, मैं चरण दर चरण समझाता हूं।",
    ],
    confidence: [
      "विश्वास संख्या दिखाती है कि ऐप परिणाम के बारे में कितना निश्चित है।",
      "अधिक संख्या का मतलब है कि ऐप अधिक निश्चित है।",
      "अगर विश्वास कम है, तो बेहतर रोशनी में एक और फोटो लेना अच्छा है।",
    ],
    severity: [
      "गंभीरता बताती है कि पत्ती का कितना हिस्सा रोग से प्रभावित है।",
      "कम गंभीरता का मतलब है कि केवल छोटा हिस्सा प्रभावित है।",
      "अधिक गंभीरता का मतलब है कि पत्ती का बड़ा हिस्सा रोगग्रस्त है।",
    ],
    redRust: [
      "लाल जंग पत्तियों पर लाल-भूरे धब्बों के रूप में दिखाई देता है।",
      "यह नम परिस्थितियों में फैलता है।",
      "प्रभावित पत्तियां हटाएं और हवा का संचार बेहतर करें।",
    ],
    brownBlight: [
      "भूरा ब्लाइट पत्तियों पर गहरे भूरे धब्बे बनाता है।",
      "यह अक्सर गीले मौसम में दिखाई देता है।",
      "संक्रमित पत्तियां हटाकर नष्ट करें।",
    ],
    blisterBlight: [
      "ब्लिस्टर ब्लाइट युवा पत्तियों पर हल्के, सफेद छाले बनाता है।",
      "यह ठंडे, नम मौसम में आम है।",
      "प्रभावित पत्तियां हटानी चाहिए।",
    ],
    healthy: [
      "अच्छी खबर! आपकी पत्ती स्वस्थ दिखती है।",
      "हरा रंग और बनावट सामान्य दिखती है।",
    ],
    uncertain: [
      "ऐप स्पष्ट रोग पैटर्न की पहचान नहीं कर सका।",
      "अच्छी रोशनी में एक और फोटो लेने का प्रयास करें।",
    ],
    action: [
      "विश्वास स्तर के आधार पर, आपको यह करना चाहिए:",
      "अगर विश्वास अधिक है, तो तुरंत उपचार शुरू कर सकते हैं।",
      "अगर विश्वास मध्यम है, तो 2-3 दिन प्रतीक्षा करें और फिर जांचें।",
    ],
    default: [
      "मैं समझता हूं कि आपका एक प्रश्न है।",
      "रोग, विश्वास स्कोर, या क्या करना है, इसके बारे में पूछ सकते हैं।",
    ],
  },
};

function getResponse(lang: Language, topic: string): string {
  const topicResponses = responses[lang][topic] || responses[lang].default;
  return topicResponses.join(' ');
}

function detectTopic(input: string, disease: DiseaseType): string {
  const lower = input.toLowerCase();
  
  if (lower.includes('confidence') || lower.includes('sure') || lower.includes('certain') ||
      lower.includes('आत्मबিশ্বাস') || lower.includes('विश्वास')) {
    return 'confidence';
  }
  
  if (lower.includes('severity') || lower.includes('serious') || lower.includes('bad') ||
      lower.includes('গুৰুত্ব') || lower.includes('गंभीरता')) {
    return 'severity';
  }
  
  if (lower.includes('action') || lower.includes('do') || lower.includes('what') ||
      lower.includes('কি কৰিব') || lower.includes('क्या करें')) {
    return 'action';
  }
  
  if (lower.includes('disease') || lower.includes('tell') || lower.includes('explain') ||
      lower.includes('ৰোগ') || lower.includes('रोग')) {
    return disease;
  }
  
  return disease; // Default to explaining the detected disease
}

export function Chatbot({ result, isOpen, onClose }: ChatbotProps) {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with greeting and result explanation
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const confidenceLevel = getConfidenceLevel(result.confidence);
      const diseaseExplanation = getResponse(language, result.disease);
      const actionExplanation = getResponse(language, 'action');
      
      setMessages([
        { role: 'bot', content: getResponse(language, 'greeting') },
        { role: 'bot', content: diseaseExplanation },
        { role: 'bot', content: `${t('confidence')}: ${result.confidence}%. ${getResponse(language, 'confidence')}` },
        { role: 'bot', content: actionExplanation },
      ]);
    }
  }, [isOpen, language, result, t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    // Simple keyword-based response
    setTimeout(() => {
      const topic = detectTopic(userMessage, result.disease);
      const response = getResponse(language, topic);
      setMessages(prev => [...prev, { role: 'bot', content: response }]);
    }, 500);
  };

  if (!isOpen) return null;

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

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
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
        <div className="p-4 border-t border-border">
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
      </div>
    </div>
  );
}
