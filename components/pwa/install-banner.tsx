"use client";

import * as React from "react";
import { Button } from "@/components/croftly/button";
import { PIcon } from "@/components/pwa/online";

// Subtle, dismissible "Add Croftly to your home screen" banner. Reproduced from
// the prototype PWA surfaces, but backed by the real `beforeinstallprompt` event
// (Android/Chrome) with explicit iOS/Safari "Add to Home Screen" guidance.
const INSTALL_KEY = "croftly_install_dismissed";

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export function InstallBanner() {
  const [shown, setShown] = React.useState(false);
  const [isIOS, setIsIOS] = React.useState(false);
  const deferred = React.useRef<BIPEvent | null>(null);

  React.useEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(INSTALL_KEY) === "1";
    } catch {
      /* ignore */
    }
    if (dismissed) return;

    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (standalone) return; // already installed

    const onBIP = (e: Event) => {
      e.preventDefault();
      deferred.current = e as BIPEvent;
      setShown(true);
    };
    window.addEventListener("beforeinstallprompt", onBIP);

    // iOS/Safari has no beforeinstallprompt — show guidance instead.
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    let t: ReturnType<typeof setTimeout> | undefined;
    if (ios) {
      setIsIOS(true);
      t = setTimeout(() => setShown(true), 900);
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP);
      if (t) clearTimeout(t);
    };
  }, []);

  function dismiss() {
    setShown(false);
    try {
      localStorage.setItem(INSTALL_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  async function install() {
    const e = deferred.current;
    if (e) {
      await e.prompt();
      await e.userChoice;
    }
    dismiss();
  }

  if (!shown) return null;

  return (
    <div
      role="dialog"
      aria-label="Add Croftly to your home screen"
      className="croftly-install-banner"
      style={{
        position: "fixed",
        left: "1.25rem",
        bottom: "1.25rem",
        zIndex: 70,
        width: "min(22rem, calc(100vw - 2.5rem))",
        background: "var(--color-white)",
        border: "1px solid var(--color-ink-15)",
        borderRadius: "var(--radius-card)",
        boxShadow: "var(--shadow-md)",
        padding: "1rem 1.1rem",
        animation: "croftlyInstallIn var(--dur-slow) var(--ease-standard)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.8rem" }}>
        <span style={{ flexShrink: 0, width: "2.5rem", height: "2.5rem", borderRadius: "var(--radius-input)", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "var(--color-olive-drab-lightest)", color: "var(--color-olive-drab-dark)" }}>
          <PIcon name="smartphone" size={22} stroke={1.8} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-regular)", color: "var(--color-neutral-darkest)" }}>
            Add Croftly to your home screen
          </p>
          <p style={{ margin: "0.2rem 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", lineHeight: "var(--leading-snug)", color: "var(--color-neutral-dark)" }}>
            {isIOS ? "Tap the Share icon, then “Add to Home Screen.” It still works offline." : "Open your box in one tap — and it still works when you're offline."}
          </p>
        </div>
        <button type="button" onClick={dismiss} aria-label="Dismiss" style={{ flexShrink: 0, marginTop: "-0.15rem", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "1.75rem", height: "1.75rem", borderRadius: "var(--radius-pill)", background: "transparent", border: "none", cursor: "pointer", color: "var(--color-neutral)" }}>
          <PIcon name="x" size={18} stroke={2} />
        </button>
      </div>
      {!isIOS && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.85rem" }}>
          <Button size="sm" onClick={install}>Add to home screen</Button>
          <Button size="sm" variant="link" onClick={dismiss}>Not now</Button>
        </div>
      )}
    </div>
  );
}
