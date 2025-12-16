import React, { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { Smartphone, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPWA: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const checkInstalled = () => {
      const installed = window.matchMedia('(display-mode: standalone)').matches || 
                       (window.navigator as any).standalone;
      setIsInstalled(installed);
      return installed;
    };

    if (checkInstalled()) return;

    // Check if permanently dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed === 'permanent') return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show banner after short delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    
    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowBanner(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      setDeferredPrompt(null);
      setShowBanner(false);
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
    } catch (error) {
      console.error('Install failed:', error);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-install-dismissed', 'session');
  };

  if (isInstalled || !showBanner) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <Smartphone className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-primary-foreground">
                Install Health Journal for better experience
              </p>
              <p className="text-xs text-primary-foreground/80 hidden sm:block">
                Quick access, offline support, and native app experience
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button 
              size="sm" 
              onClick={handleInstall}
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              Install
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleDismiss}
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPWA;