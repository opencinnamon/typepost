export function SetupRequiredNotice() {
  return (
    <div
      style={{
        border: "1px solid #e0b83a",
        background: "#fffdf3",
        color: "#5c4a13",
        padding: 12,
        fontSize: 12,
        margin: "16px 0",
      }}
    >
      <strong>typepost isn&apos;t connected to a database yet.</strong>
      <p style={{ margin: "6px 0 0" }}>
        Set <code>SUPABASE_URL</code>, <code>SUPABASE_SERVICE_ROLE_KEY</code>,{" "}
        <code>NEXT_PUBLIC_SUPABASE_URL</code>, and{" "}
        <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in your Vercel project&apos;s
        Environment Variables, then redeploy. See SETUP.md in the project for
        the exact steps.
      </p>
    </div>
  );
}
