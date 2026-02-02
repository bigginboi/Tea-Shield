import { Leaf } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { NetworkIndicator } from './NetworkIndicator';

export function Header() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl hero-gradient shadow-glow animate-leaf-sway">
            <Leaf className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-foreground tracking-wide">
              {t('appName')}
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block font-medium">
              {t('tagline')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <NetworkIndicator />
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
