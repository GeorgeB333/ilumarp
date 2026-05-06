import { useState, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { TeaserPage } from "@/components/site/TeaserPage";
import { IntroAnimation } from "@/components/site/IntroAnimation";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "ILUMA — Stay Tuned" },
      {
        name: "description",
        content: "Soon on RAGE:MP",
      },
      { property: "og:title", content: "ILUMA — Stay Tuned" },
      {
        property: "og:description",
        content: "Soon on RAGE:MP",
      },
    ],
  }),
});

function Index() {
  const [introComplete, setIntroComplete] = useState(false);
  const handleIntroComplete = useCallback(() => setIntroComplete(true), []);

  return (
    <>
      {!introComplete && <IntroAnimation onComplete={handleIntroComplete} />}
      <main
        className="relative min-h-screen bg-background text-foreground overflow-x-hidden"
        style={{
          opacity: introComplete ? 1 : 0,
          transition: "opacity 0.8s ease-in-out",
        }}
      >
        <Navbar />
        <TeaserPage />
      </main>
    </>
  );
}
