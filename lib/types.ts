export interface Thread {
  id: number;
  board_code: string;
  subject: string | null;
  name: string;
  body: string;
  image_url: string | null;
  image_width: number | null;
  image_height: number | null;
  created_at: string;
  bumped_at: string;
  reply_count: number;
  is_pinned: boolean;
}

export interface Post {
  id: number;
  thread_id: number;
  board_code: string;
  name: string;
  body: string;
  image_url: string | null;
  image_width: number | null;
  image_height: number | null;
  created_at: string;
}

export interface ThreadWithPosts extends Thread {
  posts: Post[];
}
