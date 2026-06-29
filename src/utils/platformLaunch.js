/**
 * Local midnight when the header CTA switches from "Join Waitlist" to "Join Platform".
 * June 25, 2026 at 12:00 AM (raat 12 ke baad).
 */
export const PLATFORM_LAUNCH_AT = new Date(2026, 5, 25, 0, 0, 0, 0);

/** Pre-launch waitlist window closes end of day July 15, 2026 (local time). */
export const PRE_LAUNCH_END_AT = new Date(2026, 6, 15, 23, 59, 59, 999);

export const PRE_LAUNCH_END_LABEL = '15 July 2026';

export const isPlatformLaunched = (now = new Date()) => now >= PLATFORM_LAUNCH_AT;

export const isPreLaunchActive = (now = new Date()) => now < PRE_LAUNCH_END_AT;

export const getMsUntilPlatformLaunch = (now = new Date()) =>
  Math.max(0, PLATFORM_LAUNCH_AT.getTime() - now.getTime());

export const getMsUntilPreLaunchEnd = (now = new Date()) =>
  Math.max(0, PRE_LAUNCH_END_AT.getTime() - now.getTime());
