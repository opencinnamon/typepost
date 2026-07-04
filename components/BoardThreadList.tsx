import Link from "next/link";
import { PostView } from "./PostView";
import type { Thread } from "@/lib/types";

export function BoardThreadList({
  threads,
  boardSlug,
}: {
  threads: Thread[];
  boardSlug: string;
}) {
  return (
    <div>
      {threads.map((thread) => (
        <div
          key={thread.id}
          className={`thread-block ${thread.is_pinned ? "pinned" : ""}`}
        >
          {thread.is_pinned && <span className="pinned-tag">[PINNED]</span>}
          <PostView
            post={thread}
            variant="op"
            showThreadLink
            boardSlug={boardSlug}
            threadId={thread.id}
          />
          <div className="thread-meta-line">
            {thread.reply_count > 0 ? (
              <>
                {thread.reply_count}{" "}
                {thread.reply_count === 1 ? "reply" : "replies"} —{" "}
                <Link href={`/b/${boardSlug}/${thread.id}`}>
                  View thread
                </Link>
              </>
            ) : (
              <Link href={`/b/${boardSlug}/${thread.id}`}>
                No replies yet — view thread
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
