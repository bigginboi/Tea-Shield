import { Clock, Coins, ShieldCheck, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DiseaseType } from '@/lib/diseaseAnalyzer';
import { getTreatmentInfo } from '@/lib/treatmentData';

interface TreatmentPlanProps {
  disease: DiseaseType;
}

export function TreatmentPlan({ disease }: TreatmentPlanProps) {
  const { t, language } = useLanguage();
  const [expanded, setExpanded] = useState(true);
  
  const treatment = getTreatmentInfo(disease, language);
  
  if (!treatment) return null;

  return (
    <div className="result-card space-y-5 fade-in delay-200">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between"
      >
        <h2 className="text-xl font-display font-semibold">{t('treatmentPlan')}</h2>
        <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="space-y-6 slide-up">
          {/* Treatment Steps */}
          <div className="space-y-1">
            {treatment.steps.map((step, index) => (
              <div key={index} className="treatment-step fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="space-y-1">
                  <p className="font-semibold text-sm">
                    {t('step')} {index + 1}: {step.title}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Timing */}
          <div className="bg-secondary/50 rounded-xl p-4 space-y-2 hover-lift">
            <div className="flex items-center gap-2 text-primary">
              <Clock className="h-5 w-5" />
              <h3 className="font-semibold">{t('timing')}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {treatment.timing}
            </p>
          </div>

          {/* Low-Cost Inputs */}
          <div className="bg-accent/5 rounded-xl p-4 space-y-3 border border-accent/10 hover-lift">
            <div className="flex items-center gap-2 text-accent">
              <Coins className="h-5 w-5" />
              <h3 className="font-semibold">{t('lowCostInputs')}</h3>
            </div>
            <ul className="space-y-2">
              {treatment.lowCostInputs.map((input, index) => (
                <li 
                  key={index} 
                  className="flex items-start gap-2 text-sm text-muted-foreground fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  {input}
                </li>
              ))}
            </ul>
          </div>

          {/* Prevention Tips */}
          <div className="bg-primary/5 rounded-xl p-4 space-y-3 border border-primary/10 hover-lift">
            <div className="flex items-center gap-2 text-primary">
              <ShieldCheck className="h-5 w-5" />
              <h3 className="font-semibold">{t('preventionTips')}</h3>
            </div>
            <ul className="space-y-2">
              {treatment.preventionTips.map((tip, index) => (
                <li 
                  key={index} 
                  className="flex items-start gap-2 text-sm text-muted-foreground fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
