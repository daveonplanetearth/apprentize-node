import { Briefcase, ExternalLink } from 'lucide-react';

const WORK_HUB_SEARCH_URL = 'https://www.jobs.service.gov.uk/jobs/search';

// Work Hub's distance dropdown only offers these, so an Apprentize radius rounds up to the next
// one (15 → 20, 25 → 40): the link never covers less ground than the apprenticeship search did.
const WORK_HUB_MILES = [1, 3, 5, 10, 20, 40];

function workHubMiles(radiusMiles: number): number {
  return WORK_HUB_MILES.find((miles) => miles >= radiusMiles) ?? WORK_HUB_MILES[WORK_HUB_MILES.length - 1];
}

// Work Hub reads its search box from these query params and prefills them on arrival. Only the
// filters a tile needs are sent, so nothing else on Work Hub's side is narrowed. Every link sorts
// newest first, so the visitor lands on the most recent postings.
function workHubUrl(postcode: string, miles: number, filters: Record<string, string>): string {
  const params = new URLSearchParams({ ...filters, location: postcode, milesFromPostcode: String(miles), sortOption: 'DATE' });
  return `${WORK_HUB_SEARCH_URL}?${params.toString()}`;
}

interface WorkHubCardProps {
  postcode: string;
  radiusMiles: number;
}

export default function WorkHubCard({ postcode, radiusMiles }: WorkHubCardProps) {
  const miles = workHubMiles(radiusMiles);
  const links: { label: string; filters: Record<string, string> }[] = [
    { label: `Part-time jobs within ${miles} miles`, filters: { jobPattern: 'PART_TIME' } },
    // Work Hub's "Last 3 days" option.
    { label: 'Jobs posted in the last 3 days', filters: { postingDateRange: '3' } },
    { label: 'Retail jobs near you', filters: { keywords: 'retail' } },
  ];

  return (
    <section aria-labelledby="work-hub-heading" className="mt-10 rounded-2xl border border-line bg-card p-5 sm:p-6">
      <h2 id="work-hub-heading" className="flex items-center gap-2.5 font-display font-bold text-ink text-lg">
        <Briefcase className="w-5 h-5 text-teal shrink-0" />
        Need paid work while you search?
      </h2>
      <p className="mt-1.5 text-sm text-ink-soft">
        Find local jobs on Work Hub, the government's free job site. Experience from a job can make your apprenticeship applications stronger.
      </p>
      <ul className="mt-4 grid grid-cols-2 lg:grid-cols-3 gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={workHubUrl(postcode, miles, link.filters)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-full items-center justify-between gap-3 rounded-xl border border-line bg-paper px-4 py-3 text-sm font-semibold text-ink hover:border-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
            >
              <span>
                {link.label}
                <span className="sr-only"> (opens in new tab)</span>
              </span>
              <ExternalLink className="w-4 h-4 text-ink-soft shrink-0" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
