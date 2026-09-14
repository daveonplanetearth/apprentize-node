// The postcode shapes Apprentize.Api's PostcodeGeocoder accepts, checked in the browser so an
// obvious typo gets an instant answer instead of a round trip. Keep these in step with
// FullPostcodeRegex/OutcodeRegex there: anything this lets through the API still checks, but
// anything it rejects never reaches the API at all.

// A full postcode always ends with an inward code (digit + 2 letters); an outcode never does.
const FULL_POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2}$/;
const OUTCODE = /^[A-Z]{1,2}\d[A-Z\d]?$/;

export const POSTCODE_FORMAT_ERROR = "That doesn't look like a postcode. Try something like SW1A 1AA or SW1A.";

/** Normalised the way the API normalises before matching: trimmed, upper case, no spaces. */
function normalize(postcode: string): string {
  return postcode.trim().toUpperCase().replace(/ /g, '');
}

/** True for a full postcode ("SW1A 1AA") or an outcode ("SW1A"), in any case and spacing. */
export function isPostcodeShaped(postcode: string): boolean {
  const normalized = normalize(postcode);
  return FULL_POSTCODE.test(normalized) || OUTCODE.test(normalized);
}

/** Whether two typed postcodes are the same once case and spacing are ignored. */
export function samePostcode(a: string, b: string): boolean {
  return normalize(a) === normalize(b);
}
