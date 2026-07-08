"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const DISMISS_KEY = "radar-install-prompt-dismissed";

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator && Boolean(window.navigator.standalone))
  );
}

export function InstallAppPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (isStandalone()) {
      setInstalled(true);
      return;
    }

    const dismissed = window.localStorage.getItem(DISMISS_KEY) === "true";
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      if (!dismissed) setVisible(true);
    };
    const handleInstalled = () => {
      setInstalled(true);
      setVisible(false);
      setInstallEvent(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  if (!visible || installed) return null;

  async function install() {
    if (!installEvent) {
      setVisible(false);
      return;
    }

    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    setInstallEvent(null);
    if (choice.outcome === "accepted") {
      setVisible(false);
    }
  }

  function dismiss() {
    window.localStorage.setItem(DISMISS_KEY, "true");
    setVisible(false);
  }

  return (
    <aside className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl rounded-2xl border border-radar-border bg-white p-4 shadow-lg sm:left-auto sm:right-6 sm:max-w-md">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-radar-blue">
          <Download className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-black text-radar-navy">Install RADAR</p>
          <p className="mt-1 text-sm leading-6 text-radar-muted">
            Pasang RADAR sebagai aplikasi agar halaman dasar dan antrean offline lebih cepat dibuka saat jaringan putus.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="btn-primary" onClick={install} type="button">
              Install aplikasi
            </button>
            <button className="btn border border-radar-border bg-white text-radar-navy" onClick={dismiss} type="button">
              Nanti saja
            </button>
          </div>
        </div>
        <button
          aria-label="Tutup prompt install"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-radar-muted hover:bg-slate-100 hover:text-radar-navy"
          onClick={dismiss}
          type="button"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
