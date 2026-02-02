import { Camera, Cpu, ClipboardCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Camera,
      title: t('step1Title'),
      description: t('step1Desc'),
      delay: 'delay-100',
    },
    {
      icon: Cpu,
      title: t('step2Title'),
      description: t('step2Desc'),
      delay: 'delay-200',
    },
    {
      icon: ClipboardCheck,
      title: t('step3Title'),
      description: t('step3Desc'),
      delay: 'delay-300',
    },
  ];

  return (
    <div className="space-y-4 fade-in delay-400">
      <h2 className="text-lg font-display font-semibold text-center flex items-center justify-center gap-2">
        <Sparkles className="h-5 w-5 text-accent" />
        {t('howItWorks')}
      </h2>
      
      <div className="grid grid-cols-3 gap-3">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`text-center space-y-2 fade-in ${step.delay}`}
          >
            <div className="mx-auto w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center shadow-soft hover-lift group cursor-default">
              <step.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-sm font-bold">{step.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
