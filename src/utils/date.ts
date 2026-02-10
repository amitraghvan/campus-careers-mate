/**
 * Date utilities for the frontend.
 */

/**
 * Format a date string to relative time (e.g., "2 days ago", "just now").
 */
export function formatDistanceToNow(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);
    const diffWeeks = Math.floor(diffDays / 7);

    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffWeeks < 4) return `${diffWeeks}w ago`;

    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

/**
 * Format a date to a short readable string.
 */
export function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

/**
 * Get month name from a date.
 */
export function getMonthName(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-IN", { month: "short" });
}

