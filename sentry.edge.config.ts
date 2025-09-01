import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://9547c97402445733b7e438868a8f9e47@o4509942152429568.ingest.us.sentry.io/4509942152691712",

  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  // ...

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});

