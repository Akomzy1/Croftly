import { Button } from "@/components/ui/button";

// PLACEHOLDER (Prompt 1 scaffold). The real home page is built from
// /design-reference/Croftly Home (standalone).html in the marketing build.
// This only confirms the scaffold runs with the Croftly design tokens wired in.
export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center scheme-soft">
      <span className="rounded-pill bg-primary/10 px-4 py-1.5 text-small font-medium text-[var(--text-accent)]">
        Prototype scaffold
      </span>
      <h1 className="max-w-[14ch] text-h2 font-semibold">
        Local farms, direct to your door.
      </h1>
      <p className="max-w-[48ch] text-medium text-[var(--text-body)]">
        Croftly connects local UK farmers directly to households — fresher,
        fairer, less waste. The scaffold and design tokens are in place; pages
        are built faithfully from the prototypes next.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button size="lg">Get started</Button>
        <Button size="lg" variant="outline">
          How it works
        </Button>
      </div>
    </main>
  );
}
