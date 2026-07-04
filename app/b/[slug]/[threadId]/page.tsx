import { notFound } from "next/navigation";
import Link from "next/link";
import { getBoardBySlug } from "@/lib/boards";
import { createServerClient } from "@/lib/supabase/server";
import type { Post, Thread } from "@/lib/types";
import { PostView } from "@/components/PostView";
import { PostForm } from "@/components/PostForm";
import { QuoteHighlighter } from "@/components/QuoteHighlighter";
import { SetupRequiredNotice } from "@/components/SetupRequiredNotice";

export const revalidate = 0;

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ slug: string; threadId: string }>;
}) {
  const { slug, threadId: threadIdRaw } = await params;
  const board = getBoardBySlug(slug);
  if (!board) notFound();

  const threadId = Number(threadIdRaw);
  if (!Number.isInteger(threadId)) notFound();

  const supabase = createServerClient();

  if (!supabase) {
    return (
      <div className="tp-main">
        <SetupRequiredNotice />
      </div>
    );
  }

  const { data: thread, error: threadError } = await supabase
    .from("threads")
    .select("*")
    .eq("id", threadId)
    .eq("board_code", board.slug)
    .single();

  if (threadError || !thread) notFound();

  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("*")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  return (
    <div className="tp-main">
      <QuoteHighlighter />
      <div className="thread-page-title">
        <Link href={`/b/${board.slug}`}>/{board.code}/</Link> -- Thread No.
        {thread.id}
      </div>

      <PostView
        post={thread as Thread}
        variant="op"
        boardSlug={board.slug}
        threadId={thread.id}
      />

      {postsError && (
        <p className="form-error">Couldn&apos;t load replies: {postsError.message}</p>
      )}

      {posts && posts.length > 0 && (
        <div style={{ marginTop: 10 }}>
          {(posts as Post[]).map((post) => (
            <PostView
              key={post.id}
              post={post}
              variant="reply"
              boardSlug={board.slug}
              threadId={thread.id}
            />
          ))}
        </div>
      )}

      <div className="reply-box">
        <h3>Post a reply</h3>
        <PostForm mode="reply" boardSlug={board.slug} threadId={thread.id} />
      </div>
    </div>
  );
}
