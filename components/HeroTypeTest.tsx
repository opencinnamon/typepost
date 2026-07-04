"use client";

import { useRef, useState } from "react";

const SNIPPETS = [
  "the quick brown fox jumps over the lazy dog",
  "sphinx of black quartz judge my vow",
  "pack my box with five dozen liquor jugs",
  "how vexingly quick daft zebras jump",
  "waltz nymph for quick jigs vex bud",
];

export function HeroTypeTest() {
  const [target] = useState(
    () => SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)]
  );
  const [typed, setTyped] = useState("");
  const [wpm, setWpm] = useState<number | null>(null);
  // Timing state lives in a ref, not useState: it's bookkeeping used to
  // derive `wpm`, not something that should itself trigger a re-render.
  const startedAtRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (val.length > target.length) return;

    // First keystroke starts the clock -- this is a direct response to
    // user input, so it belongs in the event handler, not a useEffect
    // watching `typed` (which would fire an extra render for no reason).
    if (val.length > 0 && startedAtRef.current === null) {
      startedAtRef.current = Date.now();
    }

    if (val === target && startedAtRef.current !== null) {
      const minutes = (Date.now() - startedAtRef.current) / 1000 / 60;
      setWpm(Math.round(target.split(" ").length / minutes));
    }

    setTyped(val);
  }

  const isDone = typed === target;

  return (
    <div>
      <div
        className="hero-type-target"
        onClick={() => inputRef.current?.focus()}
      >
        <span className="typed">{target.slice(0, typed.length)}</span>
        {!isDone && <span className="cursor">{target[typed.length]}</span>}
        <span className="untyped">{target.slice(typed.length + 1)}</span>
      </div>
      <input
        ref={inputRef}
        type="text"
        value={typed}
        onChange={handleChange}
        placeholder="click and start typing..."
        autoComplete="off"
        style={{
          marginTop: 6,
          fontFamily: "var(--mono)",
          fontSize: 12,
          padding: "4px 6px",
          border: "1px solid var(--input-border)",
          width: "100%",
          maxWidth: 300,
        }}
      />
      {isDone && wpm !== null && (
        <div style={{ marginTop: 4, fontSize: 11, color: "var(--greentext)" }}>
          {wpm} wpm -- not bad. post it in /wpm/.
        </div>
      )}
    </div>
  );
}
