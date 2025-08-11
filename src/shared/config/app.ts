export const APP_CONFIG = {
  name: "Medical Calendar",
  version: "0.2.0",
  description: "Календарь записи к специалистам",

  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
    timeout: 10000,
  },

  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },

  features: {
    enableOfflineMode: false,
    enableNotifications: true,
    enableAnalytics: false,
  },

  ui: {
    defaultPageSize: 20,
    animationDuration: 200,
    debounceDelay: 300,
  },
} as const;

if (typeof window === "undefined") {
  const requiredEnvVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ] as const;

  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      console.error(`Missing required environment variable: ${envVar}`);
    }
  });
}
