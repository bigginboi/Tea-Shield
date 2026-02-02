import { AlertTriangle, CheckCircle2, Info, RefreshCw, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { AnalysisResult, DiseaseType, getConfidenceLevel } from '@/lib/diseaseAnalyzer';

interface ResultDisplayProps {
  result: AnalysisResult;
  imageUrl: string;
  onReset: () => void;
  onOpenChat: () => void;
}

const diseaseColors: Record<DiseaseType, string> = {
  redRust: 'bg-disease-rust',
  brownBlight: 'bg-disease-brown',
  blisterBlight: 'bg-disease-blister text-foreground',
  healthy: 'bg-disease-healthy',
  uncertain: 'bg-muted text-muted-foreground',
};

const diseaseIcons: Record<DiseaseType, React.ReactNode> = {
  redRust: <AlertTriangle className="h-6 w-6" />,
  brownBlight: <AlertTriangle className="h-6 w-6" />,
  blisterBlight: <AlertTriangle className="h-6 w-6" />,
  healthy: <CheckCircle2 className="h-6 w-6" />,
  uncertain: <Info className="h-6 w-6" />,
};

export function ResultDisplay({ result, imageUrl, onReset, onOpenChat }: ResultDisplayProps) {
  const { t } = useLanguage();
  
  const diseaseName = t(result.disease === 'uncertain' ? 'uncertain' : result.disease);
  const confidenceLevel = getConfidenceLevel(result.confidence);
  
  const severityColor = 
    result.severity === 'low' ? 'bg-severity-low' :
    result.severity === 'medium' ? 'bg-severity-medium' :
    'bg-severity-high';

  const adviceKey = 
    confidenceLevel === 'high' ? 'adviceHighConfidence' :
    confidenceLevel === 'medium' ? 'adviceMediumConfidence' :
    'adviceLowConfidence';

  return (
    <div className="space-y-4 slide-up">
      {/* Image Preview */}
      <div className="relative rounded-2xl overflow-hidden shadow-card">
        <img 
          src={imageUrl} 
          alt="Analyzed leaf" 
          className="w-full aspect-[4/3] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        
        {/* Disease Badge */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${diseaseColors[result.disease]} text-primary-foreground font-semibold`}>
            {diseaseIcons[result.disease]}
            <span>{diseaseName}</span>
          </div>
        </div>
      </div>

      {/* Results Card */}
      <div className="result-card space-y-5">
        <h2 className="text-xl font-display font-semibold">{t('analysisResults')}</h2>

        {/* Confidence */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{t('confidence')}</span>
            <span className="font-semibold">{result.confidence}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${
                confidenceLevel === 'high' ? 'bg-disease-healthy' :
                confidenceLevel === 'medium' ? 'bg-severity-medium' :
                'bg-severity-high'
              }`}
              style={{ width: `${result.confidence}%` }}
            />
          </div>
        </div>

        {/* Severity (only for diseases) */}
        {result.disease !== 'healthy' && result.disease !== 'uncertain' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t('severity')}</span>
              <span className="font-semibold">
                {t(`severity${result.severity.charAt(0).toUpperCase() + result.severity.slice(1)}` as any)} ({result.severityPercentage}%)
              </span>
            </div>
            <div className="severity-bar">
              <div 
                className={`severity-fill ${severityColor}`}
                style={{ width: `${result.severityPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-secondary/50 rounded-xl p-3">
            <p className="text-muted-foreground text-xs">{t('leafPixels')}</p>
            <p className="font-semibold text-lg">{result.leafPixelCount.toLocaleString()}</p>
          </div>
          <div className="bg-secondary/50 rounded-xl p-3">
            <p className="text-muted-foreground text-xs">{t('infectedArea')}</p>
            <p className="font-semibold text-lg">{result.severityPercentage}%</p>
          </div>
        </div>

        {/* Advice */}
        <div className={`p-4 rounded-xl ${
          confidenceLevel === 'high' ? 'bg-disease-healthy/10 border border-disease-healthy/20' :
          confidenceLevel === 'medium' ? 'bg-severity-medium/10 border border-severity-medium/20' :
          'bg-severity-high/10 border border-severity-high/20'
        }`}>
          <p className="text-sm font-medium mb-1">{t('advice')}</p>
          <p className="text-sm text-muted-foreground">{t(adviceKey)}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={onReset}
          className="h-14 gap-2 rounded-xl"
        >
          <RefreshCw className="h-5 w-5" />
          <span>{t('analyzeAnother')}</span>
        </Button>
        
        <Button
          onClick={onOpenChat}
          className="h-14 gap-2 hero-gradient rounded-xl"
        >
          <MessageCircle className="h-5 w-5" />
          <span>{t('askChatbot')}</span>
        </Button>
      </div>
    </div>
  );
}
