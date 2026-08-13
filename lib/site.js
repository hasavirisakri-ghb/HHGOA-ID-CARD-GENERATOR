// Single source of truth for the app's public URL, used both server-side
// (layout.js metadata) and client-side (result page share text/links).
// NEXT_PUBLIC_* vars are inlined at build time, so this also works in
// client components. Override with NEXT_PUBLIC_SITE_URL if the deployment
// domain ever changes.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://hhgoa-id-card-generator-alpha.vercel.app';
