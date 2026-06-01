import { SpaceScrollHero } from "@/components/space-scroll/space-scroll-hero";
import { LandingArticles } from "@/components/landing-articles";
import { LandingTopics } from "@/components/landing-topics";
import { NewsletterSection } from "@/components/newsletter-section";
import { SignalMarquee } from "@/components/signal-marquee";
import { fetchArticles, fetchTopics } from "@/lib/api";
import { siteFeatures } from "@/lib/site-features";

export const revalidate = 60;

export default async function Home() {
  const [topics, articles] = await Promise.all([fetchTopics(), fetchArticles()]);
  const latestArticles = [...articles]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);

  return (
    <>
      <SpaceScrollHero />
      <SignalMarquee />
      <LandingTopics topics={topics} />
      <LandingArticles articles={latestArticles} />
      {siteFeatures.showNewsletter && <NewsletterSection />}
    </>
  );
}
