import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { fetchProjects } from "@/lib/api";

export const metadata = {
  title: "Projects",
  description: "Open source projects by Louis.dev",
};

export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await fetchProjects();

  return (
    <PageShell
      tag="// projects"
      title="Projects"
      subtitle="Tools, experiments, and open source work."
      maxWidth="4xl"
    >
      <div className="space-y-4">
        {projects.map((project) => (
          <Link
            key={project.name}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-sm border border-white/[0.08] bg-surface p-6 transition-all hover:border-white/20 hover:bg-white/[0.02]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-[family-name:var(--font-orbitron)] text-sm font-semibold uppercase tracking-[0.1em] text-foreground transition-colors group-hover:text-white">
                  {project.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/45">
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-sm bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-muted uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <span className="font-mono text-sm tabular-nums text-white/70">
                  ★ {project.stars}
                </span>
                <p className="mt-1 font-mono text-[10px] tracking-wider text-white/30 uppercase opacity-0 transition-opacity group-hover:opacity-100">
                  github →
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
