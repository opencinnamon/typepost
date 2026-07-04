"use client";

import { useEffect } from "react";

/**
 * Classic imageboard behavior: clicking a >>123 quote link briefly
 * flashes a highlight on the target post so you can find it in a long
 * thread. Mounted once per thread page.
 */
export function QuoteHighlighter() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const link = target.closest(".quote-link") as HTMLElement | null;
      if (!link) return;
      const postId = link.dataset.postId;
      if (!postId) return;

      const el = document.getElementById(`p${postId}`);
      if (!el) return;

      el.classList.add("post-highlight");
      setTimeout(() => el.classList.remove("post-highlight"), 1200);
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
