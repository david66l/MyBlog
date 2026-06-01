import Link from "next/link";

const navLinks = [
  { href: "/articles", label: "articles_" },
  { href: "/projects", label: "projects_" },
  { href: "/about", label: "about_" },
];

export function SiteHeader() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/[0.06] bg-black/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          className="group flex items-center gap-2 font-mono text-xs tracking-[0.15em] text-foreground uppercase"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white transition-shadow group-hover:shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
          Louis.dev
        </Link>
        <nav className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] tracking-wider text-muted uppercase transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
