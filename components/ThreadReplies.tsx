"use client";

import { useState } from "react";
import { PostView } from "@/components/PostView";
import { PostForm } from "@/components/PostForm";
import type { Post, Thread } from "@/lib/types";

interface ThreadRepliesProps {
  op: Thread;
  posts: Post[];
  boardSlug: string;
  threadId: number;
}

/**
 * Owns the "quote this post into the reply box" interaction. Needs to
 * be a client component (not the server-rendered ThreadPage) because
 * clicking a reply button on ANY post in the list needs to update the
 * single shared PostForm at the bottom -- that's cross-component state,
 * which a server component can't hold.
 *
 * Data (op, posts) is fetched server-side in the page and passed down
 * as plain props -- only the interaction lives here.
 */
export function ThreadReplies({ op, posts, boardSlug, threadId }: ThreadRepliesProps) {
  const [quotedText, setQuotedText] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  function handleQuoteReply(postBody: string) {
    const quoted = postBody
      .split("\n")
      .map((line) => `~${line}`)
      .join("\n");
    setQuotedText(`${quoted}\n\n`);
    // Force PostForm to remount with the new defaultValue -- it's an
    // uncontrolled textarea (see PostForm.tsx), so changing defaultValue
    // alone wouldn't update an already-mounted instance.
    setFormKey((k) => k + 1);

    const replyBox = document.getElementById("reply-box-anchor");
    replyBox?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <PostView
        post={op}
        variant="op"
        boardSlug={boardSlug}
        threadId={threadId}
      />

      {posts.length > 0 && (
        <div style={{ marginTop: 10 }}>
          {posts.map((post) => (
            <PostView
              key={post.id}
              post={post}
              variant="reply"
              boardSlug={boardSlug}
              threadId={threadId}
              onQuoteReply={handleQuoteReply}
            />
          ))}
        </div>
      )}

      <div className="reply-box" id="reply-box-anchor">
        <h3>Post a reply</h3>
        <PostForm
          key={formKey}
          mode="reply"
          boardSlug={boardSlug}
          threadId={threadId}
          initialBody={quotedText ?? undefined}
        />
      </div>
    </>
  );
}
