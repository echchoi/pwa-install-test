import { useEffect, useState, useRef } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface UseServiceWorkerReturn {
  isInstallable: boolean;
  isInstalled: boolean;
  deferredPrompt: BeforeInstallPromptEvent | null;
  handleInstall: () => Promise<void>;
  swActive: boolean;
  manifestLoaded: boolean;
}

export function useServiceWorker(): UseServiceWorkerReturn {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [swActive, setSwActive] = useState(false);
  const [manifestLoaded, setManifestLoaded] = useState(false);
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Check if PWA is installed on iOS
    if (
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
      setIsInstallable(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      deferredPromptRef.current = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    // Check service worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => {
          setSwActive(registrations.length > 0);
        })
        .catch(() => {
          setSwActive(false);
        });
    }
  }, []);

  useEffect(() => {
    // Check if manifest is loaded
    const checkManifest = async () => {
      try {
        const response = await fetch('manifest.json');
        setManifestLoaded(response.ok);
      } catch {
        setManifestLoaded(false);
      }
    };

    checkManifest();
  }, []);

  const handleInstall = async () => {
    if (!deferredPromptRef.current) {
      console.error('Installation prompt not available');
      return;
    }

    try {
      await deferredPromptRef.current.prompt();
      const choiceResult = await deferredPromptRef.current.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setIsInstalled(true);
      } else {
        console.log('User dismissed the install prompt');
      }
      deferredPromptRef.current = null;
    } catch (error) {
      console.error('Error during installation:', error);
    }
  };

  return {
    isInstallable,
    isInstalled,
    deferredPrompt: deferredPromptRef.current,
    handleInstall,
    swActive,
    manifestLoaded,
  };
}
