import { formatPostBody } from "@/lib/formatPost";
import { formatPostTime } from "@/lib/formatTime";
import type { Post, Thread } from "@/lib/types";

interface PostViewProps {
  post: Post | Thread;
  /** Tan "OP" background vs blue "reply" background */
  variant: "op" | "reply";
  /** Show a "[Reply -->]" link to the full thread page. Only relevant when
   * rendering an OP preview on the board index -- the thread page itself
   * already IS the thread, so this should be false there even though
   * variant is still "op". */
  showThreadLink?: boolean;
  boardSlug: string;
  threadId: number;
}

export function PostView({
  post,
  variant,
  showThreadLink = false,
  boardSlug,
  threadId,
}: PostViewProps) {
  const subject = "subject" in post ? post.subject : null;

  return (
    <div className={`post ${variant} clearfix`} id={`p${post.id}`}>
      {post.image_url && (
        <div className="post-image-wrap">
          {/* Intentionally a plain <img>, not next/image: post images come
              from arbitrary user uploads in Supabase Storage, and this
              needs to render exactly like a classic imageboard thumbnail
              (fixed max-size box, no blur-up/layout-shift handling). */}
          <a href={post.image_url} target="_blank" rel="noopener noreferrer">
            <img
              src={post.image_url}
              alt=""
              width={post.image_width ?? undefined}
              height={post.image_height ?? undefined}
              loading="lazy"
            />
          </a>
          {post.image_width && post.image_height && (
            <div className="post-image-meta">
              {post.image_width}x{post.image_height}
            </div>
          )}
        </div>
      )}
      <div className="post-header">
        {subject && <span className="post-subject">{subject}</span>}
        <span className="post-name">{post.name}</span>
        <span className="post-time">{formatPostTime(post.created_at)}</span>
        <a href={`/b/${boardSlug}/${threadId}#p${post.id}`} className="post-id-link">
          No.{post.id}
        </a>
        {showThreadLink && (
          <a href={`/b/${boardSlug}/${threadId}`} className="reply-link-inline">
            [Reply]
          </a>
        )}
      </div>
      <div className="post-body">{formatPostBody(post.body)}</div>
    </div>
  );
}
