-- typepost schema
-- Run this in the Supabase SQL Editor (Project -> SQL Editor -> New query)

-- Boards are NOT a table: they're hardcoded in lib/boards.ts since the
-- board list is fixed. Threads/posts reference boards by their short
-- "code" (e.g. 'm', 'kbl', 'qwerty') as plain text, not a foreign key,
-- to keep this simple and avoid needing a migration every time a board
-- is renamed in code.

create table if not exists threads (
  id bigint generated always as identity primary key,
  board_code text not null,
  subject text,
  name text not null default 'Anonymous',
  body text not null,
  image_url text,
  image_width int,
  image_height int,
  created_at timestamptz not null default now(),
  bumped_at timestamptz not null default now(),
  reply_count int not null default 0,
  is_pinned boolean not null default false
);

create index if not exists idx_threads_board_bumped
  on threads (board_code, bumped_at desc);

create table if not exists posts (
  id bigint generated always as identity primary key,
  thread_id bigint not null references threads(id) on delete cascade,
  board_code text not null,
  name text not null default 'Anonymous',
  body text not null,
  image_url text,
  image_width int,
  image_height int,
  created_at timestamptz not null default now()
);

create index if not exists idx_posts_thread on posts (thread_id, created_at asc);

-- Keep thread.reply_count and bumped_at in sync whenever a reply is added.
-- ("sage" is not implemented -- every reply bumps. Add a boolean column
-- later if you want sage support.)
create or replace function bump_thread_on_reply()
returns trigger as $$
begin
  update threads
  set reply_count = reply_count + 1,
      bumped_at = now()
  where id = new.thread_id;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_bump_thread on posts;
create trigger trg_bump_thread
  after insert on posts
  for each row execute function bump_thread_on_reply();

-- Row Level Security: the app talks to Postgres using the SERVICE ROLE
-- key from server-only API routes, which bypasses RLS entirely. RLS
-- below is a defense-in-depth backstop in case the anon key is ever
-- used directly against these tables (it currently is not -- the
-- browser client is only used for realtime/storage, not table access).
alter table threads enable row level security;
alter table posts enable row level security;

drop policy if exists "public read threads" on threads;
create policy "public read threads" on threads for select using (true);

drop policy if exists "public read posts" on posts;
create policy "public read posts" on posts for select using (true);

-- No insert/update/delete policies are created for the anon role.
-- All writes happen through /app/api/* routes using the service role
-- key. You (the owner) delete rows directly from the Supabase Table
-- Editor or SQL Editor, which also uses elevated access.
