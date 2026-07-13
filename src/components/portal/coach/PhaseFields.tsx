"use client";

import { useState } from "react";
import { PHASE_KEYS, PHASE_LABELS } from "@/lib/portal";

/**
 * Stage selector + "publish to everyone in this stage" toggle.
 * Shared by the video and resource forms.
 */
export function PhaseFields() {
  const [phase, setPhase] = useState("");

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <label className="flex items-center gap-3 text-xs tracking-[0.2em] text-muted uppercase">
        Stage
        <select
          name="phase"
          value={phase}
          onChange={(e) => setPhase(e.target.value)}
          className="border border-brown/30 bg-transparent px-3 py-2 text-base normal-case tracking-normal text-foreground focus:border-burgundy focus:outline-none"
        >
          <option value="">Any stage</option>
          {PHASE_KEYS.map((key) => (
            <option key={key} value={key}>
              {PHASE_LABELS[key]}
            </option>
          ))}
        </select>
      </label>

      <label
        className={`flex items-center gap-2 text-sm ${
          phase ? "text-foreground" : "text-muted/50"
        }`}
      >
        <input
          type="checkbox"
          name="share_with_phase"
          disabled={!phase}
          className="accent-burgundy"
        />
        Give this to every client in that stage
      </label>
    </div>
  );
}
