import { withBaml } from "@boundaryml/baml-nextjs-plugin";
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default withBaml()(
  withSentryConfig(nextConfig, {
    org: "active-listening-dojo",
    project: "active-listening-dojo",
    silent: !process.env.CI,
    disableLogger: true,
  }),
);
