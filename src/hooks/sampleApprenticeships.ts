import type { Apprenticeship, ApprenticeshipsResult, SortBy, SortOrder } from './useApprenticeships';
import type { ApprenticeshipDetails } from './useApprenticeshipDetails';

// Real, sortable date values behind the display strings above — hidden from the UI and
// used only to drive client-side sorting of the sample data (ascending = earliest first,
// mirroring how the live API orders by the underlying DateTime, not a "days ago" string).
type SampleApprenticeship = Apprenticeship & { postedDateValue: string; closingDateValue: string };

const SAMPLE: SampleApprenticeship[] = [
  { id: 's1', title: 'Software Developer Apprentice', company: 'Nebula Labs', level: 'Level 4', wage: '£18,000/yr', location: 'London', distanceMiles: 3.2, postedDate: '2 days ago', postedDateValue: '2026-07-31', closingDate: '18 Aug 2026', closingDateValue: '2026-08-18', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012345', numberOfPositions: 2 },
  { id: 's2', title: 'Carpentry Apprentice', company: 'Oakwood Joinery', level: 'Level 3', wage: '£15,500/yr', location: 'Manchester', distanceMiles: 8.4, postedDate: '1 day ago', postedDateValue: '2026-08-01', closingDate: '25 Aug 2026', closingDateValue: '2026-08-25', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012346', numberOfPositions: 1 },
  { id: 's3', title: 'Healthcare Assistant (Apprentice)', company: 'Riverside Care', level: 'Level 3', wage: '£14,800/yr', location: 'Birmingham', distanceMiles: 12.1, postedDate: '3 days ago', postedDateValue: '2026-07-30', closingDate: '10 Aug 2026', closingDateValue: '2026-08-10', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012347', numberOfPositions: 3 },
  { id: 's4', title: 'Engineering Apprentice', company: 'Atlas Manufacturing', level: 'Level 4', wage: '£19,200/yr', location: 'Leeds', distanceMiles: 6.7, postedDate: 'Today', postedDateValue: '2026-08-02', closingDate: '5 Sep 2026', closingDateValue: '2026-09-05', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012348', numberOfPositions: 1 },
  { id: 's5', title: 'Digital Marketing Apprentice', company: 'Brightwave Agency', level: 'Level 3', wage: '£16,000/yr', location: 'Bristol', distanceMiles: 14.3, postedDate: '4 days ago', postedDateValue: '2026-07-29', closingDate: '15 Aug 2026', closingDateValue: '2026-08-15', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012349' },
  { id: 's6', title: 'Electrician Apprentice', company: 'Volts & Co', level: 'Level 3', wage: '£17,000/yr', location: 'Sheffield', distanceMiles: 9.8, postedDate: '2 days ago', postedDateValue: '2026-07-31', closingDate: '30 Aug 2026', closingDateValue: '2026-08-30', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012350', numberOfPositions: 2 },
  { id: 's7', title: 'Business Administration Apprentice', company: 'Hilltop Services', level: 'Level 2', wage: '£12,500/yr', location: 'Liverpool', distanceMiles: 11.5, postedDate: '5 days ago', postedDateValue: '2026-07-28', closingDate: '12 Aug 2026', closingDateValue: '2026-08-12', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012351', numberOfPositions: 4 },
  { id: 's8', title: 'Cyber Security Apprentice', company: 'Sentinel Defence', level: 'Level 4', wage: '£21,000/yr', location: 'London', distanceMiles: 4.1, postedDate: 'Today', postedDateValue: '2026-08-02', closingDate: '20 Sep 2026', closingDateValue: '2026-09-20', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012352', numberOfPositions: 1 },
  { id: 's9', title: 'Plumbing Apprentice', company: 'FlowRight Heating', level: 'Level 3', wage: '£15,000/yr', location: 'Newcastle', distanceMiles: 7.2, postedDate: '1 day ago', postedDateValue: '2026-08-01', closingDate: '22 Aug 2026', closingDateValue: '2026-08-22', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012353', numberOfPositions: 2 },
  { id: 's10', title: 'Data Analyst Apprentice', company: 'Quantum Insights', level: 'Level 4', wage: '£20,500/yr', location: 'London', distanceMiles: 5.4, postedDate: '3 days ago', postedDateValue: '2026-07-30', closingDate: '8 Aug 2026', closingDateValue: '2026-08-08', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012354', numberOfPositions: 1 },
  { id: 's11', title: 'Chef Apprentice', company: 'The Copper Pan', level: 'Level 2', wage: '£13,000/yr', location: 'Edinburgh', distanceMiles: 18.6, postedDate: '6 days ago', postedDateValue: '2026-07-27', closingDate: '28 Aug 2026', closingDateValue: '2026-08-28', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012355', numberOfPositions: 3 },
  { id: 's12', title: 'Accounting Apprentice', company: 'Ledger & Stone', level: 'Level 3', wage: '£16,800/yr', location: 'Manchester', distanceMiles: 9.1, postedDate: '2 days ago', postedDateValue: '2026-07-31', closingDate: '3 Sep 2026', closingDateValue: '2026-09-03', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012356', numberOfPositions: 2 },
];

const SORT_KEY: Record<SortBy, (job: SampleApprenticeship) => number | string> = {
  postedDate: (job) => job.postedDateValue,
  closingDate: (job) => job.closingDateValue,
  distance: (job) => job.distanceMiles ?? Number.MAX_VALUE,
};

export function sampleApprenticeships(params: {
  postcode: string;
  radiusMiles: number;
  title: string;
  page: number;
  pageSize: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
}): ApprenticeshipsResult {
  const filtered = SAMPLE.filter((job) => {
    if (typeof job.distanceMiles === 'number' && job.distanceMiles > params.radiusMiles) return false;
    if (params.title.trim()) {
      const q = params.title.trim().toLowerCase();
      if (!job.title.toLowerCase().includes(q) && !job.company.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const keyFn = SORT_KEY[params.sortBy];
  const direction = params.sortOrder === 'desc' ? -1 : 1;
  const sorted = [...filtered].sort((a, b) => {
    const ka = keyFn(a);
    const kb = keyFn(b);
    if (ka < kb) return -1 * direction;
    if (ka > kb) return 1 * direction;
    return 0;
  });

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
