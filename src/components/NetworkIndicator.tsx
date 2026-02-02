import { Wifi, WifiOff, Signal } from 'lucide-react';
import { useNetwork } from '@/contexts/NetworkContext';
import { useLanguage } from '@/contexts/LanguageContext';

const labels = {
  en: {
    online: 'Online',
    offline: 'Offline',
    noConnection: 'No Internet',
  },
  as: {
    online: 'অনলাইন',
    offline: 'অফলাইন',
    noConnection: 'ইণ্টাৰনেট নাই',
  },
  hi: {
    online: 'ऑनलाइन',
    offline: 'ऑफ़लाइन',
    noConnection: 'इंटरनेट नहीं',
  },
};

export function NetworkIndicator() {
  const { mode, isActuallyOnline, toggleMode } = useNetwork();
  const { language } = useLanguage();
  const t = labels[language] || labels.en;

  const isOfflineMode = mode === 'offline';
  const noConnection = !isActuallyOnline && mode === 'online';

  return (
    <button
      onClick={toggleMode}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 hover-lift ${
        noConnection
          ? 'bg-destructive/10 text-destructive border border-destructive/20'
          : isOfflineMode
          ? 'bg-muted text-muted-foreground border border-border'
          : 'bg-disease-healthy/10 text-disease-healthy border border-disease-healthy/20'
      }`}
    >
      {noConnection ? (
        <>
          <Signal className="h-3 w-3" />
          <span>{t.noConnection}</span>
        </>
      ) : isOfflineMode ? (
        <>
          <WifiOff className="h-3 w-3" />
          <span>{t.offline}</span>
        </>
      ) : (
        <>
          <Wifi className="h-3 w-3" />
          <span>{t.online}</span>
        </>
      )}
    </button>
  );
}
