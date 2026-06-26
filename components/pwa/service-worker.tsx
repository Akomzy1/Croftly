"use client";

import * as React from "react";

// Registers the service worker (public/sw.js). Production only — keeps dev free
// of stale-cache surprises. The SW itself implements the cache-first app-shell /
// network-first live-data split.
export function ServiceWorkerRegistrar() {
  React.useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* registration failure is non-fatal */
    });
  }, []);
  return null;
}
