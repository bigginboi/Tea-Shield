import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type NetworkMode = 'online' | 'offline';

interface NetworkContextType {
  mode: NetworkMode;
  isOnline: boolean;
  isActuallyOnline: boolean;
  setMode: (mode: NetworkMode) => void;
  toggleMode: () => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<NetworkMode>(() => {
    const saved = localStorage.getItem('tea-shield-network-mode');
    return (saved as NetworkMode) || 'online';
  });
  
  const [isActuallyOnline, setIsActuallyOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsActuallyOnline(true);
    const handleOffline = () => setIsActuallyOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const setMode = useCallback((newMode: NetworkMode) => {
    setModeState(newMode);
    localStorage.setItem('tea-shield-network-mode', newMode);
  }, []);

  const toggleMode = useCallback(() => {
    setMode(mode === 'online' ? 'offline' : 'online');
  }, [mode, setMode]);

  // Effective online status - user chose online AND device is actually online
  const isOnline = mode === 'online' && isActuallyOnline;

  return (
    <NetworkContext.Provider value={{ mode, isOnline, isActuallyOnline, setMode, toggleMode }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
}
