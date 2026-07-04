import Link from "next/link";
import { CATEGORIES, boardsByCategory } from "@/lib/boards";

export function Footer() {
  return (
    <footer className="tp-footer">
      {CATEGORIES.map((cat) => (
        <div className="board-list-line" key={cat}>
          <strong>[{cat}]</strong>{" "}
          {boardsByCategory(cat).map((b) => (
            <Link key={b.slug} href={`/b/${b.slug}`}>
              {b.code}
            </Link>
          ))}
        </div>
      ))}
      <p>typepost is a fan-made community board for typing &amp; keyboard enthusiasts. not affiliated with Monkeytype, TypeGG, Typeracer, or Zentype.in.</p>
      <p>all posts are anonymous. you are responsible for what you post.</p>
    </footer>
  );
}
