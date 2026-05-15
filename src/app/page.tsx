import type { Metadata } from "next";

import HeroAnimate from "./components/HeroAnimate";

export const metadata: Metadata = {
  title: "Storycraft Studio | Premium Media Agency",
  description:
    "A cinematic, high-performance landing page for a premium media agency built with Next.js, TypeScript, and motion-first storytelling.",
};

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-neutral-950 text-white">
      <HeroAnimate videoUrl="https://your-azure-cdn-link.azureedge.net/hero-background.mp4" />
    </main>
  );
}
