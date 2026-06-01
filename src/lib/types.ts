export type Category =
  | "ai-agent"
  | "llm"
  | "toolchain"
  | "engineering"
  | "reading"
  | "thoughts"
  | "astrobiology"
  | "exoplanets"
  | "extremophiles";

export interface Topic {
  slug: Category;
  icon: string;
  title: string;
  description: string;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: Category;
  categoryLabel: string;
  date: string;
  readTime: string;
  coverGradient: string;
  content: string;
}

export interface Project {
  name: string;
  description: string;
  stars: number;
  url: string;
  tags: string[];
}
