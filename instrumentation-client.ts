import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://9547c97402445733b7e438868a8f9e47@o4509942152429568.ingest.us.sentry.io/4509942152691712",
  sendDefaultPii: true,
  integrations: [
    // Add client-specific integrations here if needed
  ],
  // Add any client-specific configuration here
});

// This export will instrument router navigations, and is only relevant if you enable tracing.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;