import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { SmoothScroll } from "@/components/site/SmoothScroll";

function NotFoundComponent() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">
      <div className="pointer-events-none absolute inset-0 scanlines opacity-30" />
      <div className="relative max-w-lg">
        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary">
          [ Signal lost · 404 ]
        </div>
        <h1 className="display-tight mt-6 text-7xl md:text-8xl">
          Off the <span className="text-gradient">grid.</span>
        </h1>
        <p className="mt-6 text-muted-foreground leading-relaxed">
          This address doesn't answer. The page may have moved, been redacted, or never existed in the first place.
        </p>
        <div className="mt-10">
          <Link to="/" className="btn-cine">
            <span>Return to surface</span>
            <span className="btn-arrow">↘</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ILUMA — A Rage MP Roleplay Server" },
      { name: "description", content: "A second life in Los Santos. Built on Rage MP. No tutorials. No safety nets." },
      { property: "og:title", content: "ILUMA — A Rage MP Roleplay Server" },
      { property: "og:description", content: "A second life in a city that finally feels alive." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400..700&family=Roboto+Mono:wght@400;500&family=Tilt+Warp&family=Unbounded:wght@800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <SmoothScroll />
      <Outlet />
    </>
  );
}
