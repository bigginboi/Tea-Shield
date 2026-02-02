import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export function LanguageToggle() {
  const { cycleLanguage, languageLabel } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={cycleLanguage}
      className="gap-2 bg-card/80 backdrop-blur-sm border-border/50 hover:bg-secondary transition-all duration-200"
    >
      <Globe className="h-4 w-4" />
      <span className="font-medium">{languageLabel}</span>
    </Button>
  );
}
