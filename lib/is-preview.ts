// Helper to determine if we're in a preview environment
export function isPreviewEnvironment() {
  // Check if we're in a preview environment (Vercel preview or local development)
  return process.env.VERCEL_ENV === "preview" || process.env.NODE_ENV === "development" || typeof window !== "undefined"
}
