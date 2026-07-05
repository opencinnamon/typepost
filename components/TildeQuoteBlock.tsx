"use client";

import { useState } from "react";

const TRUNCATE_CHAR_LIMIT = 200;
const TRUNCATE_LINE_LIMIT = 3;

/**
 * Renders a ~quoted block (the text a "reply" button pre-filled from
 * another post). If the combined quoted text is short, it just renders
 * plainly. If it's long (over TRUNCATE_CHAR_LIMIT chars or more than
 * TRUNCATE_LINE_LIMIT lines), it renders truncated with a small [+]
 * button that expands to the full text and turns into [-] to collapse
 * again.
 *
 * `lines` are the raw ~-prefixed lines (tilde already stripped) that
 * were grouped together as one contiguous quote block by formatPost.tsx.
 */
export function TildeQuoteBlock({ lines }: { lines: string[] }) {
  const [expanded, setExpanded] = useState(false);

  const fullText = lines.join("\n");
  const isLong = fullText.length > TRUNCATE_CHAR_LIMIT || lines.length > TRUNCATE_LINE_LIMIT;

  if (!isLong) {
    return (
      <>
        {lines.map((line, i) => (
          <div key={i} className="tilde-quote">
            {line || "\u00A0"}
          </div>
        ))}
      </>
    );
  }

  const truncatedLines = lines.slice(0, TRUNCATE_LINE_LIMIT);
  let truncatedText = truncatedLines.join("\n");
  if (truncatedText.length > TRUNCATE_CHAR_LIMIT) {
    truncatedText = truncatedText.slice(0, TRUNCATE_CHAR_LIMIT);
  }

  return (
    <div className="quote-expand-wrap">
      {expanded ? (
        lines.map((line, i) => (
          <div key={i} className="tilde-quote">
            {line || "\u00A0"}
          </div>
        ))
      ) : (
        <div className="tilde-quote">
          {truncatedText}
          {"\u2026"}
        </div>
      )}
      <button
        type="button"
        className="quote-expand-btn"
        onClick={() => setExpanded((v) => !v)}
        aria-label={expanded ? "Show less of quoted text" : "Show more of quoted text"}
        title={expanded ? "View less" : "View more"}
      >
        {expanded ? "\u2212" : "+"}
      </button>
    </div>
  );
}
