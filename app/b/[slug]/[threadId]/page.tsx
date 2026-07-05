import { notFound } from "next/navigation";
import Link from "next/link";
import { getBoardBySlug } from "@/lib/boards";
import { createServerClient } from "@/lib/supabase/server";
import type { Post, Thread } from "@/lib/types";
import { ThreadReplies } from "@/components/ThreadReplies";
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

      {postsError && (
        <p className="form-error">Couldn&apos;t load replies: {postsError.message}</p>
      )}

      <ThreadReplies
        op={thread as Thread}
        posts={(posts as Post[]) ?? []}
        boardSlug={board.slug}
        threadId={thread.id}
      />
    </div>
  );
}
