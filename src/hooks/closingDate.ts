// A vacancy closing within this many days is flagged on the results cards and the details page.
const CLOSING_SOON_DAYS = 7;

/**
 * "Closes today" / "Closes tomorrow" / "Closes in N days" for a vacancy closing soon, or null when
 * it isn't (or the day count is unknown) and the plain closing date should be shown instead. The
 * one wording for both pages.
 */
export function closingSoonLabel(closesInDays: number | null | undefined): string | null {
  if (typeof closesInDays !== 'number' || closesInDays < 0 || closesInDays > CLOSING_SOON_DAYS) return null;
  if (closesInDays === 0) return 'Closes today';
  if (closesInDays === 1) return 'Closes tomorrow';
  return `Closes in ${closesInDays} days`;
}

/**
 * Whole days from today to a raw closing timestamp, for the details page, whose endpoint sends the
 * date rather than the search endpoint's pre-computed closesInDays. Mirrors
 * SearchApprenticeshipsEndpoints.cs's ClosesInDays: the timestamp's own calendar day against
 * today's UTC day, so both pages agree about the same vacancy.
 */
export function daysUntil(iso?: string): number | null {
  const match = iso ? /^(\d{4})-(\d{2})-(\d{2})/.exec(iso) : null;
  if (!match) return null;
  const closing = Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.round((closing - today) / 86_400_000);
}
