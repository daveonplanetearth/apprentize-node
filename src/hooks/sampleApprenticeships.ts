import type { Apprenticeship, ApprenticeshipsResult, SortChoice } from './useApprenticeships';
import type { ApprenticeshipDetails } from './useApprenticeshipDetails';

// Dates are days from today rather than fixed dates, so the fixtures never go stale: every listing
// stays open, and a few always fall inside the closing-soon window, as live data would.
type SampleRow = Omit<Apprenticeship, 'postedDate' | 'closingDate' | 'closesInDays'> & {
  postedDaysAgo: number;
  closesIn: number;
};

// The real, sortable dates behind the display strings — hidden from the UI and used to sort the
// sample data and to fill the details fixtures, as the live API works from the underlying dates.
type SampleApprenticeship = Apprenticeship & { postedDateValue: string; closingDateValue: string };

const ROWS: SampleRow[] = [
  { id: 's1', title: 'Software Developer Apprentice', company: 'Nebula Labs', level: 'Level 4', wage: '£18,000/yr', location: 'London', distanceMiles: 3.2, postedDaysAgo: 2, closesIn: 16, url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012345', numberOfPositions: 2 },
  { id: 's2', title: 'Carpentry Apprentice', company: 'Oakwood Joinery', level: 'Level 3', wage: '£15,500/yr', location: 'Manchester', distanceMiles: 8.4, postedDaysAgo: 1, closesIn: 23, url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012346', numberOfPositions: 1 },
  { id: 's3', title: 'Healthcare Assistant (Apprentice)', company: 'Riverside Care', level: 'Level 3', wage: '£14,800/yr', location: 'Birmingham', distanceMiles: 12.1, postedDaysAgo: 3, closesIn: 1, url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012347', numberOfPositions: 3 },
  { id: 's4', title: 'Engineering Apprentice', company: 'Atlas Manufacturing', level: 'Level 4', wage: '£19,200/yr', location: 'Leeds', distanceMiles: 6.7, postedDaysAgo: 0, closesIn: 34, url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012348', numberOfPositions: 1 },
  { id: 's5', title: 'Digital Marketing Apprentice', company: 'Brightwave Agency', level: 'Level 3', wage: '£16,000/yr', location: 'Bristol', distanceMiles: 14.3, postedDaysAgo: 4, closesIn: 13, url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012349' },
  { id: 's6', title: 'Electrician Apprentice', company: 'Volts & Co', level: 'Level 3', wage: '£17,000/yr', location: 'Sheffield', distanceMiles: 9.8, postedDaysAgo: 2, closesIn: 28, url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012350', numberOfPositions: 2 },
  { id: 's7', title: 'Business Administration Apprentice', company: 'Hilltop Services', level: 'Level 2', wage: '£12,500/yr', location: 'Liverpool', distanceMiles: 11.5, postedDaysAgo: 5, closesIn: 5, url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012351', numberOfPositions: 4 },
  { id: 's8', title: 'Cyber Security Apprentice', company: 'Sentinel Defence', level: 'Level 4', wage: '£21,000/yr', location: 'London', distanceMiles: 4.1, postedDaysAgo: 0, closesIn: 49, url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012352', numberOfPositions: 1 },
  { id: 's9', title: 'Plumbing Apprentice', company: 'FlowRight Heating', level: 'Level 3', wage: '£15,000/yr', location: 'Newcastle', distanceMiles: 7.2, postedDaysAgo: 1, closesIn: 20, url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012353', numberOfPositions: 2 },
  { id: 's10', title: 'Data Analyst Apprentice', company: 'Quantum Insights', level: 'Level 4', wage: '£20,500/yr', location: 'London', distanceMiles: 5.4, postedDaysAgo: 3, closesIn: 0, url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012354', numberOfPositions: 1 },
  { id: 's11', title: 'Chef Apprentice', company: 'The Copper Pan', level: 'Level 2', wage: '£13,000/yr', location: 'Edinburgh', distanceMiles: 18.6, postedDaysAgo: 6, closesIn: 26, url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012355', numberOfPositions: 3 },
  { id: 's12', title: 'Accounting Apprentice', company: 'Ledger & Stone', level: 'Level 3', wage: '£16,800/yr', location: 'Manchester', distanceMiles: 9.1, postedDaysAgo: 2, closesIn: 32, url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012356', numberOfPositions: 2 },
];

// The API's closingDate format ("d MMM yyyy", invariant culture) — Intl's en-GB would say "Sept".
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Today's UTC date plus `days`, as `YYYY-MM-DD` — the day the API counts from. */
function isoFromToday(days: number): string {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + days)).toISOString().slice(0, 10);
}

function displayDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

const SAMPLE: SampleApprenticeship[] = ROWS.map(({ postedDaysAgo, closesIn, ...job }) => {
  const closingDateValue = isoFromToday(closesIn);
  return {
    ...job,
    postedDate: postedDaysAgo === 0 ? 'Today' : postedDaysAgo === 1 ? '1 day ago' : `${postedDaysAgo} days ago`,
    postedDateValue: isoFromToday(-postedDaysAgo),
    closingDate: displayDate(closingDateValue),
    closingDateValue,
    closesInDays: closesIn,
  };
});

// As SearchApprenticeshipsEndpoints.cs's ApplySort orders the two sorts the site sends: posted
// dates newest first, then nearest first within a day.
const byDistance = (a: SampleApprenticeship, b: SampleApprenticeship) =>
  (a.distanceMiles ?? Number.MAX_VALUE) - (b.distanceMiles ?? Number.MAX_VALUE);

const SORTS: Record<SortChoice, (a: SampleApprenticeship, b: SampleApprenticeship) => number> = {
  nearest: byDistance,
  newest: (a, b) => b.postedDateValue.localeCompare(a.postedDateValue) || byDistance(a, b),
};

export function sampleApprenticeships(params: {
  postcode: string;
  radiusMiles: number;
  title: string;
  page: number;
  pageSize: number;
  sort: SortChoice;
}): ApprenticeshipsResult {
  const filtered = SAMPLE.filter((job) => {
    if (typeof job.distanceMiles === 'number' && job.distanceMiles > params.radiusMiles) return false;
    if (params.title.trim()) {
      const q = params.title.trim().toLowerCase();
      if (!job.title.toLowerCase().includes(q) && !job.company.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort(SORTS[params.sort]);

  const total = sorted.length;
  const start = (params.page - 1) * params.pageSize;
  const items = sorted.slice(start, start + params.pageSize);

  return { items, page: params.page, pageSize: params.pageSize, total };
}

// Fields the /api/apprenticeship/{id} details endpoint returns that the search endpoint
// (and so SAMPLE above) doesn't carry — kept as a side table rather than widening SAMPLE,
// since the list view never needs them.
const SAMPLE_DETAIL_EXTRAS: Record<string, {
  description: string;
  hoursPerWeek: number;
  expectedDuration: string;
  address: string;
  postcode: string;
  providerName: string;
}> = {
  s1: {
    description: 'Join our small engineering team building the platform that powers Nebula Labs\' core product. You\'ll pair with senior developers on real features from day one, learn our React and .NET stack, and take part in code review, testing and deployment. Off-the-job training is one day a week towards a Level 4 Software Developer standard.',
    hoursPerWeek: 37.5,
    expectedDuration: '18 months',
    address: '4 Silicon Yard, Shoreditch, London',
    postcode: 'EC2A 3QR',
    providerName: 'Nebula Training Partners',
  },
  s2: {
    description: 'Learn traditional and modern joinery techniques alongside our workshop team, from bespoke furniture to fitted staircases. You\'ll split your time between the workshop floor and site installations, working towards a Level 3 Carpentry and Joinery qualification.',
    hoursPerWeek: 39,
    expectedDuration: '24 months',
    address: 'Unit 7, Oakwood Trading Estate, Manchester',
    postcode: 'M12 5NH',
    providerName: 'Manchester Construction College',
  },
  s3: {
    description: 'Support our care team in delivering compassionate, person-centred care to residents, including help with daily living, mobility and social activities. You\'ll be fully supported through your Level 3 Adult Care Worker apprenticeship, with a dedicated mentor throughout.',
    hoursPerWeek: 35,
    expectedDuration: '15 months',
    address: 'Riverside Care Home, 22 Mill Lane, Birmingham',
    postcode: 'B15 2TT',
    providerName: 'Birmingham Health & Care Academy',
  },
  s4: {
    description: 'Rotate through machining, assembly and quality departments at our Leeds manufacturing site, gaining hands-on engineering experience while studying towards a Level 4 Engineering Technician standard on day release.',
    hoursPerWeek: 38,
    expectedDuration: '36 months',
    address: 'Atlas Manufacturing, Kirkstall Road, Leeds',
    postcode: 'LS4 2AB',
    providerName: 'Leeds Engineering Skills Centre',
  },
  s5: {
    description: 'Get hands-on with SEO, paid social and email campaigns for a growing roster of clients. You\'ll learn analytics, content planning and campaign reporting while working towards a Level 3 Multi-Channel Marketer apprenticeship.',
    hoursPerWeek: 37,
    expectedDuration: '15 months',
    address: 'Brightwave Agency, 12 Harbourside, Bristol',
    postcode: 'BS1 5UH',
    providerName: 'Bristol Digital Skills Hub',
  },
  s6: {
    description: 'Work alongside qualified electricians on domestic and commercial installations, learning to wire, test and certify electrical systems safely. Leads to a Level 3 Installation and Maintenance Electrician qualification.',
    hoursPerWeek: 40,
    expectedDuration: '42 months',
    address: 'Volts & Co, 9 Foundry Street, Sheffield',
    postcode: 'S1 4QW',
    providerName: 'Sheffield Trades Training',
  },
  s7: {
    description: 'Support office operations across finance, HR and customer service, gaining broad administrative experience while studying towards a Level 2 Customer Service Practitioner qualification.',
    hoursPerWeek: 35,
    expectedDuration: '12 months',
    address: 'Hilltop Services, 3 Exchange Court, Liverpool',
    postcode: 'L2 2QP',
    providerName: 'Liverpool Business College',
  },
  s8: {
    description: 'Join our security operations centre to help monitor, detect and respond to threats across client networks, while studying towards a Level 4 Cyber Security Technologist apprenticeship with structured mentoring.',
    hoursPerWeek: 37.5,
    expectedDuration: '24 months',
    address: 'Sentinel Defence, 5 Fenchurch Row, London',
    postcode: 'EC3M 4AL',
    providerName: 'London Cyber Skills Academy',
  },
  s9: {
    description: 'Learn to install, service and repair domestic heating and plumbing systems alongside experienced engineers, working towards a Level 3 Plumbing and Domestic Heating Technician qualification.',
    hoursPerWeek: 40,
    expectedDuration: '36 months',
    address: 'FlowRight Heating, 18 Quayside, Newcastle upon Tyne',
    postcode: 'NE1 3DX',
    providerName: 'Newcastle Building Skills Centre',
  },
  s10: {
    description: 'Work with our analytics team to build dashboards, clean datasets and support data-driven decisions across the business, while studying towards a Level 4 Data Analyst apprenticeship.',
    hoursPerWeek: 37.5,
    expectedDuration: '18 months',
    address: 'Quantum Insights, 27 Bankside, London',
    postcode: 'SE1 9JE',
    providerName: 'London Data Skills Institute',
  },
  s11: {
    description: 'Train in our kitchen under an experienced head chef, covering food preparation, menu planning and kitchen management, while working towards a Level 2 Production Chef apprenticeship.',
    hoursPerWeek: 40,
    expectedDuration: '15 months',
    address: 'The Copper Pan, 14 Old Town, Edinburgh',
    postcode: 'EH1 1QS',
    providerName: 'Edinburgh Hospitality College',
  },
  s12: {
    description: 'Support our accounts team with bookkeeping, payroll and month-end reporting for a range of clients, while studying towards an AAT Level 3 Assistant Accountant apprenticeship.',
    hoursPerWeek: 35,
    expectedDuration: '18 months',
    address: 'Ledger & Stone, 6 Deansgate, Manchester',
    postcode: 'M3 2FN',
    providerName: 'Manchester Finance Academy',
  },
};

export function sampleApprenticeshipDetails(id: string): ApprenticeshipDetails | null {
  const job = SAMPLE.find((j) => j.id === id);
  const extra = SAMPLE_DETAIL_EXTRAS[id];
  if (!job || !extra) return null;

  return {
    id: job.id,
    title: job.title,
    employerName: job.company,
    description: extra.description,
    wage: job.wage,
    hoursPerWeek: extra.hoursPerWeek,
    expectedDuration: extra.expectedDuration,
    apprenticeshipLevel: job.level,
    postedDate: job.postedDateValue,
    closingDate: job.closingDateValue,
    address: extra.address,
    postcode: extra.postcode,
    providerName: extra.providerName,
    applyUrl: job.url ?? '',
  };
}
