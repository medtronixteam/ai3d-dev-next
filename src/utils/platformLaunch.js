/**
 * Local midnight when the header CTA switches from "Join Waitlist" to "Join Platform".
 * June 25, 2026 at 12:00 AM (raat 12 ke baad).
 */
export const PLATFORM_LAUNCH_AT = new Date(2026, 5, 25, 0, 0, 0, 0);

export const isPlatformLaunched = (now = new Date()) => now >= PLATFORM_LAUNCH_AT;

export const getMsUntilPlatformLaunch = (now = new Date()) =>
  Math.max(0, PLATFORM_LAUNCH_AT.getTime() - now.getTime());
