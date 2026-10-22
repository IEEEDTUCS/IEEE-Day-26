import React, { useState, useEffect } from "react";
import { Download, X, Share } from "lucide-react";

export function InstallPrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 1. Check if app is already running in standalone PWA mode
    const isStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isStandaloneMode) {
      setIsInstalled(true);
      return;
    }

    // 2. Detect iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice =
      /iphone|ipad|ipod/.test(userAgent) &&
      !window.MSStream &&
      !window.chrome;
    setIsIOS(isIOSDevice);

    // 3. Check dismiss cooldown from localStorage (cooldown: 3 days)
    const dismissedAt = localStorage.getItem("ieee_day_pwa_dismissed");
    if (dismissedAt) {
      const daysSinceDismiss =
        (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismiss < 3) {
        return;
      }
    }

    // 4. Capture Chromium beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => {
        setIsOpen(true);
      }, 2500);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Fallback timer for browsers/iOS
    const fallbackTimer = setTimeout(() => {
      if (!isStandaloneMode && !dismissedAt) {
        setIsOpen(true);
      }
    }, 3500);

    // 5. Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsOpen(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsOpen(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSGuide((prev) => !prev);
    } else {
      setShowIOSGuide((prev) => !prev);
    }
  };

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem("ieee_day_pwa_dismissed", Date.now().toString());
  };

  if (!isOpen || isInstalled) return null;

  return (
    <div
      role="dialog"
      aria-label="Install App"
      className="fixed bottom-3 inset-x-3 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[320px] z-40 transition-all duration-300"
    >
      {/* Small Glass Card - discreet, not main attraction */}
      <div className="relative overflow-hidden bg-black/45 backdrop-blur-xl border border-white/15 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-2.5 sm:p-3">
        {/* Subtle red accent line at the top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red via-[#f04a50] to-transparent" />

        <div className="flex items-center justify-between gap-2.5">
          {/* Text block: small, clean, no logo */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red animate-pulse shrink-0" />
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white truncate">
                IEEE Day '26 App
              </h4>
            </div>
            <p className="text-[11px] text-white/60 font-sans truncate mt-0.5">
              Offline schedule & 1-tap launch
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red hover:bg-[#8c0e11] active:scale-95 text-white text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-sm"
            >
              <Download className="w-3 h-3" />
              <span>Install</span>
            </button>

            <button
              onClick={handleDismiss}
              aria-label="Dismiss prompt"
              className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Compact iOS instruction tooltip */}
        {showIOSGuide && (
          <div className="mt-2 pt-2 border-t border-white/10 text-[11px] text-white/80 space-y-1">
            <p className="font-medium text-white flex items-center gap-1.5">
              <Share className="w-3 h-3 text-blue-400 shrink-0" />
              <span>
                In Safari: Tap <strong className="text-white">Share</strong> → <strong className="text-white">Add to Home Screen</strong>
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
