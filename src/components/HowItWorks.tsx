import { Camera, Cpu, ClipboardCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Camera,
      title: t('step1Title'),
      description: t('step1Desc'),
    },
    {
      icon: Cpu,
      title: t('step2Title'),
      description: t('step2Desc'),
    },
    {
      icon: ClipboardCheck,
      title: t('step3Title'),
      description: t('step3Desc'),
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-display font-semibold text-center">{t('howItWorks')}</h2>
      
      <div className="grid grid-cols-3 gap-3">
        {steps.map((step, index) => (
          <div key={index} className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
              <step.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-sm font-semibold">{step.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
