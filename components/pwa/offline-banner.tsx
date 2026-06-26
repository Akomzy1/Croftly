"use client";

import * as React from "react";
import { useOnline, formatSynced, PIcon } from "@/components/pwa/online";

// Quiet "you're offline — showing your saved box" strip. Reproduced from the
// prototype PWA surfaces. Live data is never shown as if fresh while offline.
export function OfflineBanner() {
  const { online, lastSynced, retry } = useOnline();
  if (online) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 60,
        background: "var(--color-tulip-tree-lighter)",
        borderBottom: "1px solid var(--color-tulip-tree-light)",
        animation: "croftlyOfflineIn var(--dur-base) var(--ease-standard)",
      }}
    >
      <div className="croftly-container" style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingBlock: "0.6rem", paddingInline: "var(--section-pad-x)", flexWrap: "wrap" }}>
        <span style={{ display: "inline-flex", color: "var(--color-potters-clay-dark)" }}>
          <PIcon name="wifiOff" size={18} stroke={2} />
        </span>
        <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-potters-clay-dark)" }}>
          You&apos;re offline — showing your saved box.{" "}
          <span style={{ color: "var(--color-potters-clay)" }}>Last updated {formatSynced(lastSynced)}.</span>
        </span>
        <button
          type="button"
          onClick={retry}
          style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: "0.35rem", font: "inherit", fontFamily: "var(--font-body)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-small)", color: "var(--color-potters-clay-dark)", background: "transparent", border: "none", cursor: "pointer", padding: "0.2rem 0.1rem" }}
        >
          <PIcon name="refresh" size={15} stroke={2} /> Try again
        </button>
      </div>
    </div>
  );
}
