import Link from "next/link";

export default function NotFound() {
  return (
    <div className="tp-main" style={{ textAlign: "center", paddingTop: 60 }}>
      <h1 style={{ fontFamily: "var(--mono)", fontSize: 40, margin: 0 }}>
        404
      </h1>
      <p style={{ color: "var(--text-meta)" }}>
        That board or thread doesn&apos;t exist, or it 404&apos;d off the
        catalog.
      </p>
      <p>
        <Link href="/">Return to the front page</Link>
      </p>
    </div>
  );
}
