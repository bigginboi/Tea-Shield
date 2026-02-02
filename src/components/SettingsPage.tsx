import { Globe, Info, Leaf, Heart, Wifi, WifiOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNetwork } from '@/contexts/NetworkContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const settingsLabels = {
  en: {
    title: 'Settings',
    language: 'Language',
    languageDesc: 'Change app language',
    networkMode: 'Network Mode',
    networkModeDesc: 'Choose online or offline mode',
    online: 'Online',
    offline: 'Offline',
    onlineDesc: 'Live weather, full features',
    offlineDesc: 'Works without internet',
    about: 'About Tea-Shield',
    aboutDesc: 'Version 1.0.0',
    howItWorks: 'How It Works',
    howItWorksDesc: 'Learn about the detection process',
    madeWith: 'Made with',
    forFarmers: 'for tea farmers',
    detection: 'Color-Based Detection',
    detectionDesc: 'Tea-Shield uses HSV color analysis to detect diseases. It analyzes the hue, saturation, and brightness of each pixel in your leaf image to identify disease patterns.',
    accuracy: 'The system scores each possible disease independently and selects the one with the highest confidence. If no disease clearly dominates, it will honestly tell you the result is uncertain.',
    noAI: 'No AI guessing - just deterministic, explainable logic.',
    offlineFeatures: 'Offline Features',
    offlineFeaturesDesc: 'Disease detection works fully offline. Weather uses cached or estimated data when offline.',
  },
  as: {
    title: 'ছেটিংছ',
    language: 'ভাষা',
    languageDesc: 'এপৰ ভাষা সলনি কৰক',
    networkMode: 'নেটৱৰ্ক মোড',
    networkModeDesc: 'অনলাইন বা অফলাইন মোড বাছক',
    online: 'অনলাইন',
    offline: 'অফলাইন',
    onlineDesc: 'লাইভ বতৰ, সম্পূৰ্ণ বৈশিষ্ট্য',
    offlineDesc: 'ইণ্টাৰনেট অবিহনে কাম কৰে',
    about: 'টি-শ্বিল্ড বিষয়ে',
    aboutDesc: 'সংস্কৰণ ১.০.০',
    howItWorks: 'কেনেকৈ কাম কৰে',
    howItWorksDesc: 'চিনাক্তকৰণ প্ৰক্ৰিয়াৰ বিষয়ে জানক',
    madeWith: 'প্ৰেমেৰে নিৰ্মিত',
    forFarmers: 'চাহ খেতিয়কৰ বাবে',
    detection: 'ৰঙ-ভিত্তিক চিনাক্তকৰণ',
    detectionDesc: 'টি-শ্বিল্ডে ৰোগ চিনাক্ত কৰিবলৈ HSV ৰং বিশ্লেষণ ব্যৱহাৰ কৰে।',
    accuracy: 'ব্যৱস্থাটোৱে প্ৰতিটো সম্ভাব্য ৰোগক স্বতন্ত্ৰভাৱে স্কোৰ কৰে।',
    noAI: 'কোনো AI অনুমান নাই - কেৱল নিৰ্ধাৰিত যুক্তি।',
    offlineFeatures: 'অফলাইন বৈশিষ্ট্য',
    offlineFeaturesDesc: 'ৰোগ চিনাক্তকৰণ সম্পূৰ্ণ অফলাইনত কাম কৰে। বতৰে অফলাইনত কেছড বা আনুমানিক তথ্য ব্যৱহাৰ কৰে।',
  },
  hi: {
    title: 'सेटिंग्स',
    language: 'भाषा',
    languageDesc: 'ऐप भाषा बदलें',
    networkMode: 'नेटवर्क मोड',
    networkModeDesc: 'ऑनलाइन या ऑफ़लाइन मोड चुनें',
    online: 'ऑनलाइन',
    offline: 'ऑफ़लाइन',
    onlineDesc: 'लाइव मौसम, पूर्ण सुविधाएं',
    offlineDesc: 'इंटरनेट के बिना काम करता है',
    about: 'टी-शील्ड के बारे में',
    aboutDesc: 'संस्करण 1.0.0',
    howItWorks: 'यह कैसे काम करता है',
    howItWorksDesc: 'पहचान प्रक्रिया के बारे में जानें',
    madeWith: 'प्यार से बनाया गया',
    forFarmers: 'चाय किसानों के लिए',
    detection: 'रंग-आधारित पहचान',
    detectionDesc: 'टी-शील्ड रोगों का पता लगाने के लिए HSV रंग विश्लेषण का उपयोग करता है।',
    accuracy: 'सिस्टम प्रत्येक संभावित रोग को स्वतंत्र रूप से स्कोर करता है।',
    noAI: 'कोई AI अनुमान नहीं - केवल निर्धारित तर्क।',
    offlineFeatures: 'ऑफ़लाइन सुविधाएं',
    offlineFeaturesDesc: 'रोग पहचान पूरी तरह ऑफ़लाइन काम करती है। मौसम ऑफ़लाइन में कैश्ड या अनुमानित डेटा का उपयोग करता है।',
  },
};

export function SettingsPage() {
  const { language, cycleLanguage, languageLabel } = useLanguage();
  const { mode, setMode, isActuallyOnline } = useNetwork();
  const labels = settingsLabels[language] || settingsLabels.en;

  return (
    <div className="space-y-4 fade-in">
      <h2 className="text-2xl font-display font-bold">{labels.title}</h2>

      {/* Network Mode Setting */}
      <div className="glass-card p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mode === 'online' ? 'bg-disease-healthy/10' : 'bg-muted'}`}>
              {mode === 'online' ? (
                <Wifi className="h-5 w-5 text-disease-healthy" />
              ) : (
                <WifiOff className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="font-semibold">{labels.networkMode}</p>
              <p className="text-sm text-muted-foreground">{labels.networkModeDesc}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setMode('online')}
            disabled={!isActuallyOnline}
            className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
              mode === 'online' 
                ? 'border-disease-healthy bg-disease-healthy/5' 
                : 'border-border hover:border-primary/30'
            } ${!isActuallyOnline ? 'opacity-50 cursor-not-allowed' : 'hover-lift'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Wifi className={`h-4 w-4 ${mode === 'online' ? 'text-disease-healthy' : 'text-muted-foreground'}`} />
              <span className="font-semibold text-sm">{labels.online}</span>
            </div>
            <p className="text-xs text-muted-foreground">{labels.onlineDesc}</p>
          </button>
          
          <button
            onClick={() => setMode('offline')}
            className={`p-4 rounded-xl border-2 text-left transition-all duration-300 hover-lift ${
              mode === 'offline' 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/30'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <WifiOff className={`h-4 w-4 ${mode === 'offline' ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="font-semibold text-sm">{labels.offline}</span>
            </div>
            <p className="text-xs text-muted-foreground">{labels.offlineDesc}</p>
          </button>
        </div>
      </div>

      {/* Language Setting */}
      <div className="glass-card p-4 hover-lift">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">{labels.language}</p>
              <p className="text-sm text-muted-foreground">{labels.languageDesc}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={cycleLanguage}
            className="font-semibold"
          >
            {languageLabel}
          </Button>
        </div>
      </div>

      {/* Offline Features Info */}
      <div className="glass-card p-4 space-y-2 bg-secondary/30">
        <div className="flex items-center gap-2">
          <WifiOff className="h-4 w-4 text-muted-foreground" />
          <p className="font-semibold text-sm">{labels.offlineFeatures}</p>
        </div>
        <p className="text-sm text-muted-foreground">{labels.offlineFeaturesDesc}</p>
      </div>

      {/* How It Works */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Info className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="font-semibold">{labels.howItWorks}</p>
            <p className="text-sm text-muted-foreground">{labels.howItWorksDesc}</p>
          </div>
        </div>
        
        <div className="bg-secondary/50 rounded-xl p-4 space-y-3 text-sm">
          <p className="font-semibold text-primary">{labels.detection}</p>
          <p className="text-muted-foreground leading-relaxed">{labels.detectionDesc}</p>
          <p className="text-muted-foreground leading-relaxed">{labels.accuracy}</p>
          <p className="font-medium text-foreground">{labels.noAI}</p>
        </div>
      </div>

      {/* About */}
      <div className="glass-card p-4 hover-lift">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-semibold">{labels.about}</p>
            <p className="text-sm text-muted-foreground">{labels.aboutDesc}</p>
          </div>
        </div>
      </div>

      {/* Made with love */}
      <div className="text-center py-6 space-y-2">
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
          {labels.madeWith} <Heart className="h-4 w-4 text-disease-rust fill-disease-rust" /> {labels.forFarmers}
        </p>
        <p className="text-xs text-muted-foreground/60">Tea-Shield v1.0.0</p>
      </div>
    </div>
  );
}
