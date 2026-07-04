"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Signature element: tracks the user's own typing speed anywhere on the
 * page (post boxes, address bar focus doesn't count, but any textarea/
 * input on the page does) and shows it live in the header. It resets
 * after 3s of inactivity. This is the one place the "typing community"
 * subject matter is allowed to bleed into the chrome itself -- everywhere
 * else stays period-correct and disciplined.
 */
export function WpmBadge() {
  const [wpm, setWpm] = useState<number | null>(null);
  const keyTimestamps = useRef<number[]>([]);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      // Only count printable single characters, ignore modifier/nav keys
      if (e.key.length !== 1) return;
      const target = e.target as HTMLElement | null;
      const isTypable =
        target &&
        (target.tagName === "TEXTAREA" ||
          (target.tagName === "INPUT" &&
            (target as HTMLInputElement).type === "text"));
      if (!isTypable) return;

      const now = Date.now();
      keyTimestamps.current.push(now);
      // keep last 5s of keystrokes
      keyTimestamps.current = keyTimestamps.current.filter(
        (t) => now - t < 5000
      );

      if (keyTimestamps.current.length >= 3) {
        const span =
          (now - keyTimestamps.current[0]) / 1000 / 60; // minutes
        const chars = keyTimestamps.current.length;
        const words = chars / 5;
        const instantWpm = span > 0 ? Math.round(words / span) : 0;
        setWpm(Math.min(instantWpm, 250));
      }

      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => {
        setWpm(null);
        keyTimestamps.current = [];
      }, 3000);
    }

    window.addEventListener("keydown", onKeydown);
    return () => {
      window.removeEventListener("keydown", onKeydown);
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  return (
    <span className="wpm-badge" title="your live typing speed on this page">
      {wpm !== null ? (
        <>
          <strong>{wpm}</strong> wpm
        </>
      ) : (
        <>— wpm</>
      )}
    </span>
  );
}
