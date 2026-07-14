import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppShell } from "../components/app-shell";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass max-w-md rounded-2xl p-10 text-center">
        <h1 className="gradient-text text-7xl font-bold">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This route doesn't exist in UniqueCRM.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="gradient-brand-bg glow-shadow-sm inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass max-w-md rounded-2xl p-10 text-center">
        <h1 className="text-xl font-semibold tracking-tight">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try refreshing or head back to the dashboard.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="gradient-brand-bg inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white"
          >
            Try again
          </button>
          <a
            href="/"
            className="glass inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/20"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "UniqueCRM — Modern CRM by UniqueWeb" },
      {
        name: "description",
        content:
          "UniqueCRM is a premium SaaS CRM by UniqueWeb — manage contacts, deals, pipelines, and revenue with a beautiful modern workspace.",
      },
      { name: "author", content: "UniqueWeb" },
      { property: "og:title", content: "UniqueCRM — Modern CRM by UniqueWeb" },
      {
        property: "og:description",
        content:
          "UniqueCRM is a premium SaaS CRM by UniqueWeb — manage contacts, deals, pipelines, and revenue with a beautiful modern workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "UniqueCRM — Modern CRM by UniqueWeb" },
      { name: "twitter:description", content: "UniqueCRM is a premium SaaS CRM by UniqueWeb — manage contacts, deals, pipelines, and revenue with a beautiful modern workspace." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/de44c946-bd54-4c72-8164-9f8ada923d54/id-preview-8c42bdba--5a6c42a3-95b1-474a-8bbb-133d1311affe.lovable.app-1783983896317.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/de44c946-bd54-4c72-8164-9f8ada923d54/id-preview-8c42bdba--5a6c42a3-95b1-474a-8bbb-133d1311affe.lovable.app-1783983896317.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
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
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AppShell>
        <Outlet />
      </AppShell>
    </QueryClientProvider>
  );
}
