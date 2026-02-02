import { useState } from 'react';
import { Leaf } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { ImageUploader } from '@/components/ImageUploader';
import { ResultDisplay } from '@/components/ResultDisplay';
import { Chatbot } from '@/components/Chatbot';
import { HowItWorks } from '@/components/HowItWorks';
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
      
      <main className="container max-w-lg mx-auto px-4 py-6 space-y-8">
        {/* Hero Section */}
        {!result && (
          <div className="text-center space-y-4 slide-up">
            <div className="mx-auto w-20 h-20 rounded-3xl hero-gradient flex items-center justify-center shadow-card">
              <Leaf className="h-10 w-10 text-primary-foreground" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-display font-bold text-foreground">
                {t('welcomeTitle')}
              </h1>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                {t('welcomeSubtitle')}
              </p>
            </div>
          </div>
        )}

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
      <footer className="container max-w-lg mx-auto px-4 py-6 text-center">
        <p className="text-xs text-muted-foreground">
          {t('appName')} • {t('tagline')}
        </p>
      </footer>
    </div>
  );
};

export default Index;
