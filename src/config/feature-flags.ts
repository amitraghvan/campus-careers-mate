/**
 * Feature Flags
 * Toggle features on/off without code changes.
 * In production, these would come from a remote config service.
 */

export const FEATURE_FLAGS = {
  /** Show preparation/checklist module */
  enablePreparation: true,

  /** Show analytics charts on dashboard */
  enableAnalytics: true,

  /** Enable dark/light theme toggle */
  enableThemeToggle: false,

  /** Enable notifications for upcoming deadlines */
  enableDeadlineNotifications: false,

  /** Enable export to CSV/PDF */
  enableExport: false,

  /** Enable collaborative features */
  enableCollaboration: false,

  /** Show sample data for new users */
  showSampleData: true,
} as const;

export type FeatureFlags = typeof FEATURE_FLAGS;
