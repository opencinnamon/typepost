-- Run this AFTER creating a bucket named 'typepost-images' in
-- Supabase Dashboard -> Storage -> New bucket.
-- Set the bucket to PUBLIC when creating it (checkbox in the UI),
-- so images can be displayed directly via their public URL.

-- Allow anyone to read files (needed since the bucket serves post images
-- to all visitors). Uploads are NOT allowed directly from the browser --
-- they go through /app/api/upload, which uses the service role key,
-- so no public insert policy is needed here.

drop policy if exists "public read images" on storage.objects;
create policy "public read images"
on storage.objects for select
using (bucket_id = 'typepost-images');
