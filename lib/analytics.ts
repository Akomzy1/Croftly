// Optional analytics (PostHog). Fully optional per the build prompt: this no-ops
// unless a PostHog browser client is present on `window`. To enable, set
// NEXT_PUBLIC_POSTHOG_KEY and load PostHog (snippet or posthog-js) — `track`
// will then forward events. No hard dependency, so the app runs without it.
type Props = Record<string, unknown>;

export function track(event: string, props?: Props): void {
  if (typeof window === "undefined") return;
  const ph = (window as unknown as { posthog?: { capture?: (e: string, p?: Props) => void } }).posthog;
  ph?.capture?.(event, props);
}
