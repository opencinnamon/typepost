import Link from "next/link";
import { WpmBadge } from "./WpmBadge";
import { CATEGORIES, boardsByCategory } from "@/lib/boards";

export function Header() {
  return (
    <>
      <header className="tp-header">
        <div>
          <div className="tp-logo">
            <Link href="/">
              type<span className="accent">post</span>
            </Link>
          </div>
          <div className="tp-tagline">the fastest board on the internet</div>
        </div>
        <WpmBadge />
      </header>
      <nav className="tp-navbar">
        {CATEGORIES.map((cat, ci) => (
          <span key={cat}>
            {ci > 0 && <span className="sep">|</span>}
            {boardsByCategory(cat).map((b, bi) => (
              <span key={b.slug}>
                {bi > 0 && <span className="sep">/</span>}
                <Link href={`/b/${b.slug}`}>{b.code}</Link>
              </span>
            ))}
          </span>
        ))}
      </nav>
    </>
  );
}
