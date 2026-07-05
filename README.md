
<p align="center">
  <a href="https://tposts.mtgoals.cc">
  <img src="http://cdn.mtgoals.cc/images/typepostlogo.png" width="200" />
</p>

<p align="center">

  <a href="https://discord.gg/WwB6rMYQ2W">
    <img src="https://img.shields.io/discord/1521933938032119889?logo=discord&label=Discord" />
  </a>

  <img src="https://img.shields.io/github/license/opencinnamon/typepost" />
  <img src="https://img.shields.io/github/last-commit/opencinnamon/typepost" />

  <p align="center">
  <a href="#typepost">About</a> •
  <a href="#hosting">Hosting</a> •
  <a href="#local-development">Local Hosting</a>
</p>

  <br/><br/>

> [!NOTE]
> Typepost is currently in beta, so unexpected issues may occur.
> Changes will happen constantly. If you find a bug, report it to us via Discord.

### Typepost

Typepost is a remake of "[monkeypost](https://posts.mtgoals.cc)", but it is not a straight copy and it changes quite a few things in how it works and feels.

The main idea behind it is anonymity. There are no accounts, no sign-ups, and nothing to manage. You just open the site and post. Everything is posted without tying it to a user profile, so the focus stays on the content itself rather than who wrote it.

Moderation is kept very light. Posts are not heavily filtered or controlled, but there is still some basic handling in place to remove content that is off-topic or does not belong in the space. The goal is not to police everything, but to keep the boards usable and on track.

The design takes inspiration from 4chan. It is intentionally simple and minimal, with a focus on speed and readability instead of modern social media styling. The layout is meant to feel familiar to anyone who has used traditional imageboard-style sites, where content comes first and everything else is secondary.

### Hosting

You can host Typepost yourself using Supabase by forking this repository and setting up your own instance. All of the required database setup and configuration steps are included in the Supabase folder here: https://github.com/opencinnamon/typepost/tree/main/supabase.

Inside that folder you will find the SQL and setup instructions needed to get everything running. It is recommended to enable Row Level Security (RLS) to make sure your database is properly protected.

You will also need to create a storage bucket called `typepost-images`. This is used for image uploads when users create posts. You can rename the bucket if you want, but if you do, you will need to update the corresponding references in the codebase so uploads continue to work correctly.

This project is open source under the MIT License, so you are free to fork and modify it. If you do use it or build on top of it, you are expected to provide credit to the original author (Kiirod) or include a link back to this repository.

### Local Development

To run Typepost locally, you need Node.js installed on your machine.

1. Clone the repository  
`git clone https://github.com/opencinnamon/typepost.git`

2. Move into the project directory  
`cd typepost`

3. Install dependencies  
`npm install`

4. Create a `.env.local` file in the root of the project and add your Supabase credentials:  
`NEXT_PUBLIC_SUPABASE_URL=your_supabase_url`
`NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key`

6. Start the development server  
`npm run dev`

7. Open your browser and go to  
http://localhost:3000
