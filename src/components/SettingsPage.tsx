import { Globe, Info, Leaf, Heart, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const settingsLabels = {
  en: {
    title: 'Settings',
    language: 'Language',
    languageDesc: 'Change app language',
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
  },
  as: {
    title: 'ছেটিংছ',
    language: 'ভাষা',
    languageDesc: 'এপৰ ভাষা সলনি কৰক',
    about: 'টি-শ্বিল্ড বিষয়ে',
    aboutDesc: 'সংস্কৰণ ১.০.০',
    howItWorks: 'কেনেকৈ কাম কৰে',
    howItWorksDesc: 'চিনাক্তকৰণ প্ৰক্ৰিয়াৰ বিষয়ে জানক',
    madeWith: 'প্ৰেমেৰে নিৰ্মিত',
    forFarmers: 'চাহ খেতিয়কৰ বাবে',
    detection: 'ৰঙ-ভিত্তিক চিনাক্তকৰণ',
    detectionDesc: 'টি-শ্বিল্ডে ৰোগ চিনাক্ত কৰিবলৈ HSV ৰং বিশ্লেষণ ব্যৱহাৰ কৰে। ই ৰোগৰ আৰ্হি চিনাক্ত কৰিবলৈ আপোনাৰ পাতৰ ছবিৰ প্ৰতিটো পিক্সেলৰ হিউ, চেচুৰেচন আৰু উজ্জ্বলতা বিশ্লেষণ কৰে।',
    accuracy: 'ব্যৱস্থাটোৱে প্ৰতিটো সম্ভাব্য ৰোগক স্বতন্ত্ৰভাৱে স্কোৰ কৰে আৰু সৰ্বোচ্চ আত্মবিশ্বাস থকাটো বাছনি কৰে।',
    noAI: 'কোনো AI অনুমান নাই - কেৱল নিৰ্ধাৰিত, ব্যাখ্যাযোগ্য যুক্তি।',
  },
  hi: {
    title: 'सेटिंग्स',
    language: 'भाषा',
    languageDesc: 'ऐप भाषा बदलें',
    about: 'टी-शील्ड के बारे में',
    aboutDesc: 'संस्करण 1.0.0',
    howItWorks: 'यह कैसे काम करता है',
    howItWorksDesc: 'पहचान प्रक्रिया के बारे में जानें',
    madeWith: 'प्यार से बनाया गया',
    forFarmers: 'चाय किसानों के लिए',
    detection: 'रंग-आधारित पहचान',
    detectionDesc: 'टी-शील्ड रोगों का पता लगाने के लिए HSV रंग विश्लेषण का उपयोग करता है। यह रोग पैटर्न की पहचान के लिए आपकी पत्ती की छवि के प्रत्येक पिक्सेल के ह्यू, सैचुरेशन और ब्राइटनेस का विश्लेषण करता है।',
    accuracy: 'सिस्टम प्रत्येक संभावित रोग को स्वतंत्र रूप से स्कोर करता है और सबसे अधिक विश्वास वाले को चुनता है।',
    noAI: 'कोई AI अनुमान नहीं - केवल निर्धारित, समझाने योग्य तर्क।',
  },
};

export function SettingsPage() {
  const { language, cycleLanguage, languageLabel } = useLanguage();
  const labels = settingsLabels[language] || settingsLabels.en;

  return (
    <div className="space-y-4 fade-in">
      <h2 className="text-2xl font-display font-bold">{labels.title}</h2>

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
