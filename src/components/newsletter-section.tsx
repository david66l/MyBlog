"use client";

export function NewsletterSection() {
  return (
    <section className="border-t border-white/[0.06] bg-black">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-20 text-center">
        <p className="font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase">
          // subscribe
        </p>
        <h2 className="font-[family-name:var(--font-orbitron)] text-xl font-semibold uppercase tracking-[0.12em] text-white">
          Newsletter
        </h2>
        <p className="max-w-md text-sm text-white/45">
          新文章发布时收到通知，无垃圾邮件。
        </p>
        <form
          className="flex w-full max-w-md gap-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 rounded-sm border border-white/[0.12] bg-transparent px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-white/25 outline-none transition-colors focus:border-white/30"
          />
          <button
            type="submit"
            className="rounded-sm bg-white px-5 py-2.5 font-mono text-sm font-medium text-black transition-opacity hover:opacity-90"
          >
            join_
          </button>
        </form>
      </div>
    </section>
  );
}
