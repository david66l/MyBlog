import Link from "next/link";
import { siteFeatures } from "@/lib/site-features";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-black">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-12">
        {siteFeatures.showSocialLinks && (
          <div className="flex items-center gap-6">
            {[
              { label: "GitHub", href: "https://github.com" },
              { label: "Twitter", href: "https://twitter.com" },
              { label: "Email", href: "mailto:hello@louis.dev" },
            ].map((social) => (
              <Link
                key={social.label}
                href={social.href}
                className="font-mono text-[11px] tracking-wider text-muted uppercase transition-colors hover:text-white"
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                {social.label}
              </Link>
            ))}
          </div>
        )}
        <p className="font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase">
          © 2025 · Louis.dev
        </p>
      </div>
    </footer>
  );
}
