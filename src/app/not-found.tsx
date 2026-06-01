import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center px-6 py-32 text-center">
      <div className="pointer-events-none absolute inset-6 hidden md:block" aria-hidden>
        <span className="absolute top-0 left-0 h-8 w-8 border-t border-l border-white/15" />
        <span className="absolute top-0 right-0 h-8 w-8 border-t border-r border-white/15" />
        <span className="absolute bottom-0 left-0 h-8 w-8 border-b border-l border-white/15" />
        <span className="absolute right-0 bottom-0 h-8 w-8 border-r border-b border-white/15" />
      </div>

      <p className="font-mono text-[11px] tracking-[0.3em] text-white/40 uppercase">// 404</p>
      <h1 className="mt-4 font-[family-name:var(--font-orbitron)] text-2xl font-semibold uppercase tracking-[0.14em] text-white">
        Signal lost
      </h1>
      <p className="mt-3 max-w-sm text-sm text-white/45">
        你访问的页面不存在，可能已被移除或 URL 有误。
      </p>
      <Link
        href="/"
        className="mt-8 rounded-sm bg-white px-6 py-2.5 font-mono text-sm font-medium text-black transition-opacity hover:opacity-90"
      >
        home_
      </Link>
    </main>
  );
}
