/**
 * Rewrites a Supabase Storage public URL to use a custom CDN domain
 * instead, at DISPLAY time only.
 *
 * Deliberately NOT applied when the URL is generated at upload time
 * (see app/api/threads/route.ts and app/api/posts/route.ts) -- those
 * still store the raw Supabase URL in the database. This function is
 * only called where an image is actually rendered (PostView.tsx).
 *
 * Why the split: if the CDN domain ever changes (new subdomain, new
 * provider, or you later put a different proxy in front of storage),
 * changing NEXT_PUBLIC_IMAGE_CDN_HOST below is a one-line fix that
 * retroactively repairs every image ever posted. If the domain were
 * instead baked into the URL at upload time and stored in the
 * database, changing it later would require a database migration to
 * fix old posts' broken links.
 *
 * Requires an actual DNS/proxy setup pointing NEXT_PUBLIC_IMAGE_CDN_HOST
 * at your Supabase storage -- see SETUP.md. Until that DNS exists,
 * this function still runs and rewrites the URL, but the resulting
 * link won't resolve to anything (same as pointing a domain you
 * haven't configured yet at any service).
 */
export function toCdnUrl(supabaseUrl: string): string {
  const cdnHost = process.env.NEXT_PUBLIC_IMAGE_CDN_HOST;

  // No CDN configured -- fall back to the original Supabase URL
  // unchanged, so images keep working even before DNS is set up.
  if (!cdnHost) return supabaseUrl;

  try {
    const parsed = new URL(supabaseUrl);
    parsed.host = cdnHost;
    parsed.protocol = "https:";
    return parsed.toString();
  } catch {
    // Not a valid URL for some reason -- return as-is rather than
    // throwing, since a broken image is a much smaller problem than
    // a crashed page.
    return supabaseUrl;
  }
}
