"use client";

import * as React from "react";

// Online/offline store + small icons — reproduced from the prototype PWA surfaces
// (Build Your Box). Lets any product screen disable live-only actions (matching,
// checkout) when offline, with an explanation. App-only chrome — not loaded on
// marketing pages.

const pwaPaths: Record<string, React.ReactNode> = {
  wifiOff: (
    <>
      <path d="M12 20h.01" />
      <path d="M8.5 16.4a5 5 0 0 1 7 0" />
      <path d="M5 12.9a10 10 0 0 1 5.2-2.7" />
      <path d="M19 12.9a10 10 0 0 0-2-1.5" />
      <path d="M2 8.8a15 15 0 0 1 4.2-2.6" />
      <path d="M22 8.8a15 15 0 0 0-11.3-3.8" />
      <path d="m2 2 20 20" />
    </>
  ),
  x: (
    <>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </>
  ),
  smartphone: (
    <>
      <rect width="14" height="20" x="5" y="2" rx="2.5" />
      <path d="M12 18h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </>
  ),
  refresh: (
    <>
      <path d="M3 12a9 9 0 0 1 9-9 9.7 9.7 0 0 1 6.7 2.7L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.7 9.7 0 0 1-6.7-2.7L3 16" />
      <path d="M8 16H3v5" />
    </>
  ),
  lock: (
    <>
      <rect width="18" height="11" x="3" y="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
};

export type PIconName = keyof typeof pwaPaths;

export function PIcon({ name, size = 20, stroke = 1.8 }: { name: PIconName; size?: number; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} aria-hidden="true">
      {pwaPaths[name]}
    </svg>
  );
}

type OnlineState = { online: boolean; lastSynced: Date | null; retry: () => void };
const OnlineContext = React.createContext<OnlineState>({ online: true, lastSynced: null, retry: () => {} });

export function OnlineProvider({ children }: { children: React.ReactNode }) {
  const [online, setOnline] = React.useState(true);
  const [lastSynced, setLastSynced] = React.useState<Date | null>(null);

  React.useEffect(() => {
    setOnline(navigator.onLine !== false);
    setLastSynced(new Date());
    const goOn = () => setOnline(true);
    const goOff = () => setOnline(false);
    window.addEventListener("online", goOn);
    window.addEventListener("offline", goOff);
    return () => {
      window.removeEventListener("online", goOn);
      window.removeEventListener("offline", goOff);
    };
  }, []);

  const retry = () => setOnline(typeof navigator !== "undefined" ? navigator.onLine !== false : true);

  return <OnlineContext.Provider value={{ online, lastSynced, retry }}>{children}</OnlineContext.Provider>;
}

export function useOnline() {
  return React.useContext(OnlineContext);
}

/** Friendly short time, e.g. "Tue 08:02". */
export function formatSynced(d: Date | null): string {
  if (!d) return "";
  const day = d.toLocaleDateString("en-GB", { weekday: "short" });
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return `${day} ${time}`;
}

/** Inline note explaining a disabled live-only action. */
export function OfflineNote({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", padding: "0.7rem 0.85rem", borderRadius: "var(--radius-input)", background: "var(--color-neutral-lightest)", border: "1px solid var(--color-ink-15)", ...style }}>
      <span style={{ display: "inline-flex", color: "var(--color-neutral)", marginTop: "0.05rem" }}>
        <PIcon name="info" size={16} stroke={2} />
      </span>
      <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-small)", lineHeight: "var(--leading-snug)", color: "var(--color-neutral-dark)" }}>{children}</span>
    </div>
  );
}
