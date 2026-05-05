import { useState, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { TeaserPage } from "@/components/site/TeaserPage";
import { IntroAnimation } from "@/components/site/IntroAnimation";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "ILUMA — Something Is Coming" },
      {
        name: "description",
        content: "A city with no rules. A story with no script. Decrypt the signal.",
      },
      { property: "og:title", content: "ILUMA — Something Is Coming" },
      {
        property: "og:description",
        content: "Decrypt the signal. Find the platform. Enter the city.",
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
