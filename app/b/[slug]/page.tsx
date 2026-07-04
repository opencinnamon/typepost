import { notFound } from "next/navigation";
import { getBoardBySlug } from "@/lib/boards";
import { createServerClient } from "@/lib/supabase/server";
import type { Thread } from "@/lib/types";
import { BoardThreadList } from "@/components/BoardThreadList";
import { PostForm } from "@/components/PostForm";
import { SetupRequiredNotice } from "@/components/SetupRequiredNotice";

export const revalidate = 0;

export default async function BoardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const board = getBoardBySlug(slug);
  if (!board) notFound();

  const supabase = createServerClient();

  let threads: Thread[] | null = null;
  let error: { message: string } | null = null;

  if (!supabase) {
    error = { message: "Database not configured." };
  } else {
    const result = await supabase
      .from("threads")
      .select("*")
      .eq("board_code", board.slug)
      .order("is_pinned", { ascending: false })
      .order("bumped_at", { ascending: false });
    threads = result.data as Thread[] | null;
    error = result.error;
  }

  return (
    <div className="tp-main">
      <div className="board-title-bar">
        <h1>/{board.code}/ - {board.name}</h1>
        <div className="board-desc">{board.description}</div>
      </div>

      {!supabase ? (
        <SetupRequiredNotice />
      ) : (
        <>
          <details className="new-thread-box">
            <summary>Start a new thread</summary>
            <PostForm mode="thread" boardSlug={board.slug} />
          </details>

          {error && (
            <p className="form-error">
              Couldn&apos;t load threads: {error.message}. Have you run
              schema.sql in Supabase?
            </p>
          )}

          {!error && threads && threads.length === 0 && (
            <p style={{ color: "var(--text-meta)", fontSize: 12 }}>
              No threads yet. Be the first to post in /{board.code}/.
            </p>
          )}

          {!error && threads && (
            <BoardThreadList threads={threads} boardSlug={board.slug} />
          )}
        </>
      )}
    </div>
  );
}
