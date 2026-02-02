import { useState, useCallback } from 'react';
import { Leaf, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { ImageUploader } from '@/components/ImageUploader';
import { ResultDisplay } from '@/components/ResultDisplay';
import { Chatbot } from '@/components/Chatbot';
import { HowItWorks } from '@/components/HowItWorks';
import { WeatherWidget } from '@/components/WeatherWidget';
import { BottomNav, TabId } from '@/components/BottomNav';
import { HistoryPage, HistoryItem } from '@/components/HistoryPage';
import { SettingsPage } from '@/components/SettingsPage';
import { AnalysisResult } from '@/lib/diseaseAnalyzer';

const Index = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const handleAnalysisComplete = useCallback((analysisResult: AnalysisResult, imgUrl: string) => {
    setResult(analysisResult);
    setImageUrl(imgUrl);
    
    // Add to history
    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      disease: analysisResult.disease,
      confidence: analysisResult.confidence,
      severityPercentage: analysisResult.severityPercentage,
      timestamp: new Date(),
      imageUrl: imgUrl,
    };
    setHistory(prev => [historyItem, ...prev].slice(0, 20)); // Keep last 20
  }, []);

  const handleReset = useCallback(() => {
    setResult(null);
    setImageUrl('');
    setIsChatOpen(false);
  }, []);

  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab);
    if (tab === 'scan') {
      handleReset();
    }
  }, [handleReset]);

  const handleHistorySelect = useCallback((item: HistoryItem) => {
    // Create a minimal result from history
    setResult({
      disease: item.disease,
      confidence: item.confidence,
      severityPercentage: item.severityPercentage,
      severity: item.severityPercentage < 15 ? 'low' : item.severityPercentage < 40 ? 'medium' : 'high',
      scores: { redRust: 0, brownBlight: 0, blisterBlight: 0, healthy: 0, uncertain: 0 },
      leafPixelCount: 0,
      infectedPixelCount: 0,
      processingTimeMs: 0,
    });
    setImageUrl(item.imageUrl);
    setActiveTab('scan');
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6 pb-24">
            {/* Hero Section */}
            <div className="text-center space-y-5 slide-up">
              <div className="relative mx-auto w-24 h-24">
                <div className="absolute inset-0 rounded-3xl border-2 border-primary/20 rotate-slow" />
                <div className="absolute -inset-2 rounded-3xl border border-accent/10 rotate-slow" style={{ animationDirection: 'reverse' }} />
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

            <WeatherWidget />
            <HowItWorks />
          </div>
        );

      case 'scan':
        return (
          <div className="pb-24">
            {result ? (
              <ResultDisplay
                result={result}
                imageUrl={imageUrl}
                onReset={handleReset}
                onOpenChat={() => setIsChatOpen(true)}
              />
            ) : (
              <div className="space-y-6">
                <div className="text-center space-y-2 fade-in">
                  <h2 className="text-2xl font-display font-bold">{t('capturePhoto')}</h2>
                  <p className="text-muted-foreground text-sm">{t('welcomeSubtitle')}</p>
                </div>
                <ImageUploader onAnalysisComplete={handleAnalysisComplete} />
              </div>
            )}
          </div>
        );

      case 'history':
        return (
          <div className="pb-24">
            <HistoryPage 
              history={history}
              onClearHistory={() => setHistory([])}
              onSelectItem={handleHistorySelect}
            />
          </div>
        );

      case 'chat':
        return (
          <div className="pb-24 h-[calc(100vh-12rem)]">
            <Chatbot result={result} isFullPage />
          </div>
        );

      case 'settings':
        return (
          <div className="pb-24">
            <SettingsPage />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pattern-leaves">
      <Header />
      
      <main className="container max-w-lg mx-auto px-4 py-6">
        {renderContent()}
      </main>

      {/* Modal Chatbot (only when triggered from results) */}
      {result && activeTab === 'scan' && (
        <Chatbot
          result={result}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Footer - only on home */}
      {activeTab === 'home' && (
        <footer className="container max-w-lg mx-auto px-4 py-8 pb-24 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Leaf className="h-4 w-4" />
            <p className="text-sm font-medium">
              {t('appName')} • {t('tagline')}
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Index;
