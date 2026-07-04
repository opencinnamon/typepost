import React from "react";

export function formatPostBody(body: string) {
  const lines = body.split("\n");

  return lines.map((line, i) => {
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
