import { withBaml } from "@boundaryml/baml-nextjs-plugin";
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native NAPI modules must be `require`d at runtime, not bundled.
  serverExternalPackages: [
    "@tursodatabase/sync",
    "@tursodatabase/database-common",
    "@tursodatabase/sync-common",
  ],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

export default withBaml()(  
  withSentryConfig(nextConfig, {
    org: "active-listening-dojo",
    project: "active-listening-dojo",
    silent: !process.env.CI,
    disableLogger: true,
  })
);
