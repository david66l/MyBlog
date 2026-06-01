import type { ReactNode } from "react";

const maxWidthClass = {
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "6xl": "max-w-6xl",
  article: "max-w-[720px]",
} as const;

interface PageShellProps {
  tag?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  maxWidth?: keyof typeof maxWidthClass;
}

export function PageShell({
  tag,
  title,
  subtitle,
  children,
  className = "",
  contentClassName = "",
  maxWidth = "4xl",
}: PageShellProps) {
  return (
    <main
      className={`relative mx-auto w-full px-6 py-16 lg:px-10 ${maxWidthClass[maxWidth]} ${className}`}
    >
      <div className="pointer-events-none absolute inset-6 hidden md:block" aria-hidden>
        <span className="absolute top-0 left-0 h-8 w-8 border-t border-l border-white/15" />
        <span className="absolute top-0 right-0 h-8 w-8 border-t border-r border-white/15" />
        <span className="absolute bottom-0 left-0 h-8 w-8 border-b border-l border-white/15" />
        <span className="absolute right-0 bottom-0 h-8 w-8 border-r border-b border-white/15" />
      </div>

      {tag && (
        <p className="relative font-mono text-[11px] tracking-[0.3em] text-white/40 uppercase">
          {tag}
        </p>
      )}
      <h1 className="relative mt-3 font-[family-name:var(--font-orbitron)] text-[clamp(1.5rem,3.5vw,2.25rem)] font-semibold uppercase tracking-[0.14em] text-white">
        {title}
      </h1>
      {subtitle && (
        <p className="relative mt-3 max-w-xl text-sm leading-relaxed text-white/45">
          {subtitle}
        </p>
      )}

      <div className={`relative mt-12 ${contentClassName}`}>{children}</div>
    </main>
  );
}
