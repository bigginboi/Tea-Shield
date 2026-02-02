import { Leaf } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

export function Header() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl hero-gradient">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-display font-semibold text-foreground">
              {t('appName')}
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              {t('tagline')}
            </p>
          </div>
        </div>
        
        <LanguageToggle />
      </div>
    </header>
  );
}
