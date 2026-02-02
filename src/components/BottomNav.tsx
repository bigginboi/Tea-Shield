import { ReactNode } from 'react';
import { Home, History, MessageCircle, Settings, Scan } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export type TabId = 'home' | 'scan' | 'history' | 'chat' | 'settings';

interface Tab {
  id: TabId;
  icon: React.ComponentType<{ className?: string }>;
  labelKey: string;
}

const tabs: Tab[] = [
  { id: 'home', icon: Home, labelKey: 'Home' },
  { id: 'scan', icon: Scan, labelKey: 'Scan' },
  { id: 'history', icon: History, labelKey: 'History' },
  { id: 'chat', icon: MessageCircle, labelKey: 'Chat' },
  { id: 'settings', icon: Settings, labelKey: 'Settings' },
];

const tabLabels: Record<string, Record<TabId, string>> = {
  en: { home: 'Home', scan: 'Scan', history: 'History', chat: 'Chat', settings: 'Settings' },
  as: { home: 'হোম', scan: 'স্কেন', history: 'ইতিহাস', chat: 'চেট', settings: 'ছেটিংছ' },
  hi: { home: 'होम', scan: 'स्कैन', history: 'इतिहास', chat: 'चैट', settings: 'सेटिंग्स' },
};

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { language } = useLanguage();
  const labels = tabLabels[language] || tabLabels.en;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border/50 pb-safe">
      <div className="container max-w-lg mx-auto">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex flex-col items-center justify-center py-2 px-4 min-w-[64px] transition-all duration-300 ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              >
                {/* Active indicator pill */}
                {isActive && (
                  <div className="absolute -top-1 w-12 h-1 rounded-full hero-gradient shadow-glow animate-fade-in" />
                )}
                
                {/* Icon container */}
                <div className={`relative flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary/10' 
                    : 'bg-transparent'
                }`}>
                  <Icon 
                    className={`h-5 w-5 transition-all duration-300 ${
                      isActive 
                        ? 'text-primary scale-110' 
                        : 'text-muted-foreground'
                    }`} 
                  />
                  
                  {/* Pulse effect for active */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-2xl bg-primary/10 animate-ping opacity-50" />
                  )}
                </div>
                
                {/* Label */}
                <span className={`text-[10px] mt-1 font-semibold transition-all duration-300 ${
                  isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                }`}>
                  {labels[tab.id]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Bottom safe area gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-safe bg-gradient-to-t from-card to-transparent pointer-events-none" />
    </nav>
  );
}
