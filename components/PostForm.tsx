"use client";

import { useRef, useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface PostFormProps {
  mode: "thread" | "reply";
  boardSlug: string;
  threadId?: number;
  onSuccess?: () => void;
  /** Pre-fills the comment textarea, e.g. from a quote-reply click.
   * Uses defaultValue since the textarea is uncontrolled -- the parent
   * remounts this component with a new `key` when it wants to change
   * this after initial mount (see ThreadReplies.tsx). */
  initialBody?: string;
}

export function PostForm({ mode, boardSlug, threadId, onSuccess, initialBody }: PostFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  // When pre-filled from a quote-reply click, put the cursor at the end
  // (after the quoted "~" lines and blank line) rather than the default
  // start-of-textarea, so the person can start typing their response
  // immediately without manually clicking past the quote first.
  useEffect(() => {
    if (initialBody && bodyRef.current) {
      const el = bodyRef.current;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
    // Only run on mount -- this component is remounted via `key` in
    // ThreadReplies.tsx whenever initialBody changes, so there's no
    // need to react to initialBody changing on an already-mounted instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setImagePreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function clearImage() {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setImagePreview(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);
    const body = String(formData.get("body") || "").trim();
    const imageFile = fileInputRef.current?.files?.[0];

    if (!body && !imageFile) {
      setError("Post must have a comment or an image.");
      return;
    }

    setSubmitting(true);

    try {
      if (mode === "thread") {
        formData.set("board", boardSlug);
      } else {
        formData.set("thread_id", String(threadId));
      }

      const endpoint = mode === "thread" ? "/api/threads" : "/api/posts";
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setSubmitting(false);
        return;
      }

      form.reset();
      clearImage();
      setSubmitting(false);

      if (mode === "thread") {
        router.push(`/b/${boardSlug}/${data.thread.id}`);
      } else {
        onSuccess?.();
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <table className="tp-form-table">
        <tbody>
          {mode === "thread" && (
            <tr>
              <td className="label">Subject</td>
              <td>
                <input type="text" name="subject" maxLength={100} />
              </td>
            </tr>
          )}
          <tr>
            <td className="label">Name</td>
            <td>
              <input type="text" name="name" maxLength={35} placeholder="Anonymous" />
            </td>
          </tr>
          <tr>
            <td className="label">Comment</td>
            <td>
              <textarea
                ref={bodyRef}
                name="body"
                maxLength={4000}
                rows={4}
                defaultValue={initialBody}
              />
            </td>
          </tr>
          <tr>
            <td className="label">Image</td>
            <td>
              <input
                ref={fileInputRef}
                type="file"
                name="image"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
              />
              <div className="form-hint">JPG, PNG, GIF, or WEBP. Max 6MB.</div>
              {imagePreview && (
                <div style={{ marginTop: 6 }}>
                  {/* Plain <img> is required here, not a style choice:
                      this is a data: URL from FileReader before upload,
                      which next/image cannot optimize since there's no
                      remote resource for it to fetch. */}
                  <img
                    src={imagePreview}
                    alt="preview"
                    style={{ maxWidth: 120, maxHeight: 120, display: "block" }}
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    style={{ fontSize: 11, marginTop: 4 }}
                  >
                    remove image
                  </button>
                </div>
              )}
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <button type="submit" className="tp-submit-btn" disabled={submitting}>
                {submitting ? "Posting..." : mode === "thread" ? "New Thread" : "Post Reply"}
              </button>
              {error && <div className="form-error">{error}</div>}
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
}
