"use client";

import { useDictation } from "@/hooks/useDictation";

/**
 * A textarea you can type into, paste into, or dictate into.
 * Controlled by the parent so its value can be submitted or saved.
 */
export function DictatingTextarea({
  name,
  value,
  onChange,
  rows = 6,
  placeholder,
  label,
}: {
  name?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  label?: string;
}) {
  const { supported, listening, error, start, stop } = useDictation((chunk) => {
    onChange(value ? `${value.trimEnd()} ${chunk}` : chunk);
  });

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        {label ? (
          <span className="text-xs tracking-[0.2em] text-muted uppercase">{label}</span>
        ) : (
          <span />
        )}
        {supported && (
          <button
            type="button"
            onClick={listening ? stop : start}
            className={`flex items-center gap-2 border px-3 py-1 text-[11px] tracking-[0.15em] uppercase transition-colors ${
              listening
                ? "border-burgundy bg-burgundy/10 text-burgundy"
                : "border-brown/30 text-muted hover:border-burgundy hover:text-burgundy"
            }`}
          >
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${
                listening ? "animate-[softpulse_1.2s_ease-in-out_infinite] bg-burgundy" : "bg-muted/50"
              }`}
            />
            {listening ? "Stop dictation" : "Dictate"}
          </button>
        )}
      </div>
      <textarea
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full border border-brown/30 bg-transparent px-4 py-2.5 text-base leading-relaxed text-foreground placeholder:text-muted/60 focus:border-burgundy focus:outline-none"
      />
      {error && <p className="mt-1 text-xs text-burgundy">{error}</p>}
      {listening && (
        <p className="mt-1 text-xs text-muted">Listening — speak, then press stop when done.</p>
      )}
    </div>
  );
}
