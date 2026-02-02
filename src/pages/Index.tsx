import { useState } from 'react';
import { Leaf, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { ImageUploader } from '@/components/ImageUploader';
import { ResultDisplay } from '@/components/ResultDisplay';
import { Chatbot } from '@/components/Chatbot';
import { HowItWorks } from '@/components/HowItWorks';
import { WeatherWidget } from '@/components/WeatherWidget';
import { AnalysisResult } from '@/lib/diseaseAnalyzer';

const Index = () => {
  const { t } = useLanguage();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleAnalysisComplete = (analysisResult: AnalysisResult, imgUrl: string) => {
    setResult(analysisResult);
    setImageUrl(imgUrl);
  };

  const handleReset = () => {
    setResult(null);
    setImageUrl('');
    setIsChatOpen(false);
  };

  return (
    <div className="min-h-screen bg-background pattern-leaves">
      <Header />
      
      <main className="container max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Hero Section */}
        {!result && (
          <div className="text-center space-y-5 slide-up">
            <div className="relative mx-auto w-24 h-24">
              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-3xl border-2 border-primary/20 rotate-slow" />
              <div className="absolute -inset-2 rounded-3xl border border-accent/10 rotate-slow" style={{ animationDirection: 'reverse' }} />
              
              {/* Main icon */}
              <div className="relative w-full h-full rounded-3xl hero-gradient flex items-center justify-center shadow-glow float">
                <div className="relative">
                  <Leaf className="h-12 w-12 text-primary-foreground" />
                  <Shield className="h-5 w-5 text-primary-foreground/80 absolute -bottom-1 -right-1" />
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h1 className="text-3xl font-display font-bold text-foreground">
                {t('welcomeTitle')}
              </h1>
              <p className="text-muted-foreground text-base max-w-sm mx-auto leading-relaxed">
                {t('welcomeSubtitle')}
              </p>
            </div>
          </div>
        )}

        {/* Weather Widget (only on home) */}
        {!result && <WeatherWidget />}

        {/* Main Content */}
        {result ? (
          <ResultDisplay
            result={result}
            imageUrl={imageUrl}
            onReset={handleReset}
            onOpenChat={() => setIsChatOpen(true)}
          />
        ) : (
          <>
            <ImageUploader onAnalysisComplete={handleAnalysisComplete} />
            <HowItWorks />
          </>
        )}

        {/* Chatbot */}
        {result && (
          <Chatbot
            result={result}
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="container max-w-lg mx-auto px-4 py-8 text-center">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Leaf className="h-4 w-4" />
          <p className="text-sm font-medium">
            {t('appName')} • {t('tagline')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
