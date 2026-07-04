import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import sharp from "sharp";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

const MAX_BODY_LEN = 4000;
const MAX_NAME_LEN = 35;
const MAX_IMAGE_BYTES = 6 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const threadIdRaw = formData.get("thread_id");
    const threadId = Number(threadIdRaw);
    let name = String(formData.get("name") || "").slice(0, MAX_NAME_LEN).trim();
    const body = String(formData.get("body") || "").slice(0, MAX_BODY_LEN).trim();
    const imageFile = formData.get("image") as File | null;

    if (!Number.isInteger(threadId)) {
      return NextResponse.json({ error: "Invalid thread id." }, { status: 400 });
    }

    if (!body && (!imageFile || imageFile.size === 0)) {
      return NextResponse.json(
        { error: "Reply must have a comment or an image." },
        { status: 400 }
      );
    }

    if (!name) name = "Anonymous";

    const supabase = createServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured. Set Supabase environment variables in Vercel." },
        { status: 503 }
      );
    }

    const { data: thread, error: threadError } = await supabase
      .from("threads")
      .select("id, board_code")
      .eq("id", threadId)
      .single();

    if (threadError || !thread) {
      return NextResponse.json({ error: "Thread not found." }, { status: 404 });
    }

    let imageUrl: string | null = null;
    let imageWidth: number | null = null;
    let imageHeight: number | null = null;

    if (imageFile && imageFile.size > 0) {
      if (imageFile.size > MAX_IMAGE_BYTES) {
        return NextResponse.json(
          { error: "Image too large (max 6MB)." },
          { status: 400 }
        );
      }
      if (!ALLOWED_MIME.has(imageFile.type)) {
        return NextResponse.json(
          { error: "Unsupported image type. Use JPG, PNG, GIF, or WEBP." },
          { status: 400 }
        );
      }

      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      let metadata;
      try {
        metadata = await sharp(buffer).metadata();
      } catch {
        return NextResponse.json({ error: "Invalid image file." }, { status: 400 });
      }
      imageWidth = metadata.width ?? null;
      imageHeight = metadata.height ?? null;

      const ext = extensionFor(imageFile.type);
      const path = `${thread.board_code}/${Date.now()}-${randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("typepost-images")
        .upload(path, buffer, {
          contentType: imageFile.type,
          upsert: false,
        });

      if (uploadError) {
        return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 });
      }

      const { data: publicUrlData } = supabase.storage
        .from("typepost-images")
        .getPublicUrl(path);
      imageUrl = publicUrlData.publicUrl;
    }

    const { data: post, error: insertError } = await supabase
      .from("posts")
      .insert({
        thread_id: threadId,
        board_code: thread.board_code,
        name,
        body,
        image_url: imageUrl,
        image_width: imageWidth,
        image_height: imageHeight,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    console.error("Post creation error:", err);
    return NextResponse.json(
      { error: "Unexpected error creating post." },
      { status: 500 }
    );
  }
}

function extensionFor(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/gif":
      return "gif";
    case "image/webp":
      return "webp";
    default:
      return "bin";
  }
}
