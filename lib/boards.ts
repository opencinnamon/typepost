export type Category = "Websites" | "Keyboards" | "Misc.";

export interface Board {
  slug: string; // used in URL: /b/[slug]
  code: string; // e.g. "m" for /m/
  name: string; // display name e.g. "monkeytype"
  category: Category;
  description: string;
}

export const BOARDS: Board[] = [
  {
    slug: "m",
    code: "m",
    name: "monkeytype",
    category: "Websites",
    description: "Monkeytype - typing test website",
  },
  {
    slug: "t",
    code: "t",
    name: "typegg",
    category: "Websites",
    description: "TypeGG - typing test website",
  },
  {
    slug: "r",
    code: "r",
    name: "typeracer",
    category: "Websites",
    description: "Typeracer - typing test website",
  },
  {
    slug: "zn",
    code: "zn",
    name: "zentype.in",
    category: "Websites",
    description: "Zentype.in - Niche typing test website",
  },
  {
    slug: "kb",
    code: "kb",
    name: "typing",
    category: "Keyboards",
    description: "General typing discussion",
  },
  {
    slug: "tp",
    code: "tp",
    name: "keyboards",
    category: "Keyboards",
    description: "Keyboards - keyboard pictures, keyboard recommendations",
  },
  {
    slug: "kbl",
    code: "kbl",
    name: "keyboard layouts",
    category: "Keyboards",
    description: "Keyboard layouts - you get it.",
  },
  {
    slug: "qwerty",
    code: "qwerty",
    name: "QWERTY",
    category: "Keyboards",
    description: "QWERTY - about the qwerty keyboard layout",
  },
  {
    slug: "dvorak",
    code: "dvorak",
    name: "dvorak",
    category: "Keyboards",
    description: "Dvorak - about the dvorak keyboard layout",
  },
  {
    slug: "lng",
    code: "lng",
    name: "languages",
    category: "Misc.",
    description: "Languages like English, Welsh, Swedish, etc.",
  },
  {
    slug: "wpm",
    code: "wpm",
    name: "wpm flex",
    category: "Misc.",
    description: "WPM Flex - flexing your WPM you got on any time or words.",
  },
  {
    slug: "tb",
    code: "tb",
    name: "tribe lobbies",
    category: "Misc.",
    description: "Tribe lobbies - Invite links to Monkeytype's \"Tribe\" (Multiplayer)",
  },
];

export const CATEGORIES: Category[] = ["Websites", "Keyboards", "Misc."];

export function getBoardBySlug(slug: string): Board | undefined {
  return BOARDS.find((b) => b.slug === slug);
}

export function boardsByCategory(category: Category): Board[] {
  return BOARDS.filter((b) => b.category === category);
}
