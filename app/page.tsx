import Link from "next/link";
import { CATEGORIES, boardsByCategory } from "@/lib/boards";
import { HeroTypeTest } from "@/components/HeroTypeTest";

export default function HomePage() {
  return (
    <div className="tp-main">
      <div className="hero-strip">
        <div>
          <h1>type something. see how fast you are.</h1>
          <p>
            typepost is a board for people who care way too much about their
            WPM. talk keyboards, layouts, and whichever typing site you think
            is best. twelve boards, no accounts, post anonymously.
          </p>
        </div>
        <HeroTypeTest />
      </div>

      {CATEGORIES.map((category) => (
        <div className="category-block" key={category}>
          <div className="category-title">{category}</div>
          <div className="board-grid">
            {boardsByCategory(category).map((board) => (
              <Link
                href={`/b/${board.slug}`}
                className="board-card"
                key={board.slug}
              >
                <div className="board-card-code">/{board.code}/</div>
                <div className="board-card-name">{board.name}</div>
                <div className="board-card-desc">{board.description}</div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
