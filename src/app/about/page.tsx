import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import {
  currentlyLearning,
  siteConfig,
  skills,
} from "@/lib/data";
import { siteFeatures } from "@/lib/site-features";

export const metadata = {
  title: "About",
  description: "About Louis.dev",
};

export default function AboutPage() {
  return (
    <PageShell
      tag="// about"
      title="About"
      subtitle="Developer · AI · space · building in public."
      maxWidth="3xl"
    >
      <div className="space-y-8">
        <div className="flex items-start gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-sm border border-white/10 bg-surface font-[family-name:var(--font-orbitron)] text-2xl font-semibold text-white">
            L
          </div>
          <div>
            <h2 className="font-[family-name:var(--font-orbitron)] text-sm font-semibold uppercase tracking-[0.12em] text-white">
              {siteConfig.author}
            </h2>
            <p className="mt-3 leading-relaxed text-white/45">
              全栈开发者，专注 AI 应用与工程实践。记录我在AI路上的每一步。
            </p>
          </div>
        </div>

        <section>
          <h3 className="mb-4 font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase">
            stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-sm border border-white/10 px-3 py-1.5 text-sm text-foreground"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-sm border border-white/[0.08] bg-surface p-6">
          <h3 className="mb-4 font-[family-name:var(--font-orbitron)] text-xs font-semibold uppercase tracking-[0.12em] text-white">
            Currently learning
          </h3>
          <ul className="space-y-3">
            {currentlyLearning.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-white/45">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/50" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {siteFeatures.showSocialLinks && (
          <section>
            <h3 className="mb-4 font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase">
              links
            </h3>
            <div className="flex gap-4">
              {[
                { label: "GitHub", href: "https://github.com" },
                { label: "Twitter", href: "https://twitter.com" },
                { label: "Email", href: `mailto:${siteConfig.email}` },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-mono text-[11px] tracking-wider text-muted uppercase transition-colors hover:text-white"
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {link.label} →
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
}
