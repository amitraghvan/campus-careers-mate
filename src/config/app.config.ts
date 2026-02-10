/**
 * ╔══════════════════════════════════════════════════╗
 * ║        Application Configuration                 ║
 * ║  Central config for all app-level settings       ║
 * ╚══════════════════════════════════════════════════╝
 */

export const APP_CONFIG = {
  name: "PlaceTrack",
  tagline: "Smart Placement Tracker",
  description: "Your Placement Companion — Never miss a dream opportunity",
  version: "1.0.0",

  /** Routing */
  routes: {
    home: "/",
    auth: "/auth",
    dashboard: "/dashboard",
    opportunities: "/dashboard/opportunities",
    deadlines: "/dashboard/deadlines",
    preparation: "/dashboard/preparation",
    settings: "/dashboard/settings",
  },

  /** Pagination & Limits */
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 50,
  },

  /** Deadlines */
  deadlines: {
    urgentThresholdDays: 2,
    warningThresholdDays: 5,
    maxUpcomingDisplay: 5,
  },

  /** Storage */
  storage: {
    opportunitiesKey: "placement-tracker-opportunities",
    authKey: "placement-tracker-auth",
    settingsKey: "placement-tracker-settings",
    themeKey: "placement-tracker-theme",
  },

  /** Toast */
  toast: {
    limit: 1,
    removeDelay: 1000000,
  },

  /** Breakpoints */
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1280,
  },
} as const;

export type AppConfig = typeof APP_CONFIG;

