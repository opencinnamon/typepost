import React from "react";
import { TildeQuoteBlock } from "@/components/TildeQuoteBlock";

/**
 * Renders raw post body text into JSX, applying:
 * - Greentext: lines starting with ">" (but not ">>123" quote links)
 * - Post links: ">>123" become anchors to #p123
 * - Tilde-quotes: lines starting with "~" are grouped (consecutive ~
 *   lines become one block) and rendered via TildeQuoteBlock, which
 *   handles the long-quote collapse/expand behavior.
 *
 * Quote links are same-page anchors (#p123), so no board context is
 * needed here.
 */
export function formatPostBody(body: string) {
  const rawLines = body.split("\n");

  // Group consecutive "~"-prefixed lines into blocks first, since a
  // quoted post may itself have had multiple lines/paragraphs, and the
  // collapse/expand decision needs to look at the whole quoted block
  // at once, not decide line-by-line.
  type Segment =
    | { type: "tilde"; lines: string[] }
    | { type: "line"; text: string };

  const segments: Segment[] = [];
  for (const raw of rawLines) {
    if (raw.startsWith("~")) {
      const stripped = raw.slice(1);
      const last = segments[segments.length - 1];
      if (last && last.type === "tilde") {
        last.lines.push(stripped);
      } else {
        segments.push({ type: "tilde", lines: [stripped] });
      }
    } else {
      segments.push({ type: "line", text: raw });
    }
  }

  return segments.map((seg, i) => {
    if (seg.type === "tilde") {
      return <TildeQuoteBlock key={i} lines={seg.lines} />;
    }
    const line = seg.text;
    const isGreentext = line.startsWith(">") && !line.startsWith(">>");
    const parts = renderQuoteLinks(line);

    return (
      <div key={i} className={isGreentext ? "greentext" : undefined}>
        {parts.length > 0 ? parts : "\u00A0"}
      </div>
    );
  });
}

function renderQuoteLinks(line: string) {
  const regex = />>(\d+)/g;
  const result: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      result.push(line.slice(lastIndex, match.index));
    }
    const postId = match[1];
    result.push(
      <a
        key={`q-${key++}`}
        href={`#p${postId}`}
        className="quote-link"
        data-post-id={postId}
      >
        {`>>${postId}`}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < line.length) {
    result.push(line.slice(lastIndex));
  }

  return result;
}
