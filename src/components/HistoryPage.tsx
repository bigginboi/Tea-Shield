import { Clock, Trash2, Leaf, AlertTriangle, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DiseaseType, diseaseNames } from '@/lib/diseaseAnalyzer';
import { Button } from '@/components/ui/button';

export interface HistoryItem {
  id: string;
  disease: DiseaseType;
  confidence: number;
  severityPercentage: number;
  timestamp: Date;
  imageUrl: string;
}

interface HistoryPageProps {
  history: HistoryItem[];
  onClearHistory: () => void;
  onSelectItem: (item: HistoryItem) => void;
}

const diseaseColors: Record<DiseaseType, string> = {
  redLeafSpot: 'bg-disease-rust',
  algalLeafSpot: 'bg-primary/70',
  birdsEyeSpot: 'bg-amber-500',
  grayBlight: 'bg-gray-500',
  whiteSpot: 'bg-disease-blister',
  anthracnose: 'bg-disease-brown',
  brownBlight: 'bg-disease-brown',
  healthy: 'bg-disease-healthy',
  uncertain: 'bg-muted',
};

const diseaseIcons: Record<DiseaseType, React.ReactNode> = {
  redLeafSpot: <AlertTriangle className="h-4 w-4" />,
  algalLeafSpot: <AlertTriangle className="h-4 w-4" />,
  birdsEyeSpot: <AlertTriangle className="h-4 w-4" />,
  grayBlight: <AlertTriangle className="h-4 w-4" />,
  whiteSpot: <AlertTriangle className="h-4 w-4" />,
  anthracnose: <AlertTriangle className="h-4 w-4" />,
  brownBlight: <AlertTriangle className="h-4 w-4" />,
  healthy: <CheckCircle className="h-4 w-4" />,
  uncertain: <Leaf className="h-4 w-4" />,
};

const historyLabels = {
  en: {
    title: 'Scan History',
    empty: 'No scans yet',
    emptyDesc: 'Your analysis history will appear here',
    clear: 'Clear All',
    confidence: 'Confidence',
    severity: 'Severity',
  },
  as: {
    title: 'স্কেন ইতিহাস',
    empty: 'এতিয়ালৈকে কোনো স্কেন নাই',
    emptyDesc: 'আপোনাৰ বিশ্লেষণৰ ইতিহাস ইয়াত দেখা যাব',
    clear: 'সকলো মচক',
    confidence: 'আত্মবিশ্বাস',
    severity: 'গুৰুত্ব',
  },
  hi: {
    title: 'स्कैन इतिहास',
    empty: 'अभी तक कोई स्कैन नहीं',
    emptyDesc: 'आपका विश्लेषण इतिहास यहां दिखाई देगा',
    clear: 'सब साफ करें',
    confidence: 'विश्वास',
    severity: 'गंभीरता',
  },
};

export function HistoryPage({ history, onClearHistory, onSelectItem }: HistoryPageProps) {
  const { language } = useLanguage();
  const labels = historyLabels[language] || historyLabels.en;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : 'as', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getDiseaseName = (disease: DiseaseType): string => {
    return diseaseNames[disease]?.[language] || diseaseNames[disease]?.en || disease;
  };

  return (
    <div className="space-y-4 fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold flex items-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          {labels.title}
        </h2>
        {history.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearHistory}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {labels.clear}
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center">
            <Clock className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="font-semibold text-foreground">{labels.empty}</p>
          <p className="text-sm text-muted-foreground">{labels.emptyDesc}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item, index) => (
            <button
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="w-full glass-card p-4 flex items-center gap-4 hover-lift fade-in text-left"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-soft">
                <img 
                  src={item.imageUrl} 
                  alt="Scan" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${diseaseColors[item.disease]} ${item.disease === 'whiteSpot' ? 'text-foreground' : 'text-primary-foreground'}`}>
                    {diseaseIcons[item.disease]}
                    {getDiseaseName(item.disease)}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{labels.confidence}: {item.confidence}%</span>
                  <span>{labels.severity}: {item.severityPercentage}%</span>
                </div>
                
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(item.timestamp)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
