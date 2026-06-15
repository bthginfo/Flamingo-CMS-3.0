export function DemoBanner() {
  return (
    <div className="bg-amber-500 text-amber-950 text-sm font-medium py-2 px-4">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 text-center sm:flex-row sm:justify-between">
        <p>
          🎯 Demo-Modus — Änderungen werden gespeichert, aber nicht veröffentlicht. <span className="opacity-70">Session läuft nach 1h ab.</span>
        </p>
        <a
          href="https://www.flamingomedia.online"
          className="shrink-0 rounded-full bg-amber-950 px-3 py-1 text-xs font-bold text-amber-50 transition hover:bg-black"
        >
          Zurück zu Flamingo Media
        </a>
      </div>
    </div>
  );
}
