import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  href?: string;
  linkText?: string;
}

export function SectionHeader({ title, href, linkText = "view_all →" }: SectionHeaderProps) {
  return (
    <div className="mb-10 flex items-end justify-between">
      <h2 className="font-[family-name:var(--font-orbitron)] text-xl font-semibold uppercase tracking-[0.12em] text-white md:text-2xl">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="font-mono text-xs text-muted uppercase transition-colors hover:text-white"
        >
          {linkText}
        </Link>
      )}
    </div>
  );
}
