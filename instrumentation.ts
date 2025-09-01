import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Server-side Sentry init
    Sentry.init({
      dsn: "https://9547c97402445733b7e438868a8f9e47@o4509942152429568.ingest.us.sentry.io/4509942152691712",
      sendDefaultPii: true,
      integrations: [],
      // Add any server-specific configuration here
    });
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    // Edge runtime Sentry init
    Sentry.init({
      dsn: "https://9547c97402445733b7e438868a8f9e47@o4509942152429568.ingest.us.sentry.io/4509942152691712",
      sendDefaultPii: true,
      // Add any edge-specific configuration here
    });
  }
}

// Optional: Add error boundary for React Server Components
export const onRequestError = Sentry.captureRequestError;