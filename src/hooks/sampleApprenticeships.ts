import type { Apprenticeship, ApprenticeshipsResult, SortBy, SortOrder } from './useApprenticeships';

// Real, sortable date values behind the display strings above — hidden from the UI and
// used only to drive client-side sorting of the sample data (ascending = earliest first,
// mirroring how the live API orders by the underlying DateTime, not a "days ago" string).
type SampleApprenticeship = Apprenticeship & { postedDateValue: string; closingDateValue: string };

const SAMPLE: SampleApprenticeship[] = [
  { id: 's1', title: 'Software Developer Apprentice', company: 'Nebula Labs', level: 'Level 4', wage: '£18,000/yr', location: 'London', distanceMiles: 3.2, postedDate: '2 days ago', postedDateValue: '2026-07-31', closingDate: '18 Aug 2026', closingDateValue: '2026-08-18', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012345' },
  { id: 's2', title: 'Carpentry Apprentice', company: 'Oakwood Joinery', level: 'Level 3', wage: '£15,500/yr', location: 'Manchester', distanceMiles: 8.4, postedDate: '1 day ago', postedDateValue: '2026-08-01', closingDate: '25 Aug 2026', closingDateValue: '2026-08-25', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012346' },
  { id: 's3', title: 'Healthcare Assistant (Apprentice)', company: 'Riverside Care', level: 'Level 3', wage: '£14,800/yr', location: 'Birmingham', distanceMiles: 12.1, postedDate: '3 days ago', postedDateValue: '2026-07-30', closingDate: '10 Aug 2026', closingDateValue: '2026-08-10', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012347' },
  { id: 's4', title: 'Engineering Apprentice', company: 'Atlas Manufacturing', level: 'Level 4', wage: '£19,200/yr', location: 'Leeds', distanceMiles: 6.7, postedDate: 'Today', postedDateValue: '2026-08-02', closingDate: '5 Sep 2026', closingDateValue: '2026-09-05', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012348' },
  { id: 's5', title: 'Digital Marketing Apprentice', company: 'Brightwave Agency', level: 'Level 3', wage: '£16,000/yr', location: 'Bristol', distanceMiles: 14.3, postedDate: '4 days ago', postedDateValue: '2026-07-29', closingDate: '15 Aug 2026', closingDateValue: '2026-08-15', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012349' },
  { id: 's6', title: 'Electrician Apprentice', company: 'Volts & Co', level: 'Level 3', wage: '£17,000/yr', location: 'Sheffield', distanceMiles: 9.8, postedDate: '2 days ago', postedDateValue: '2026-07-31', closingDate: '30 Aug 2026', closingDateValue: '2026-08-30', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012350' },
  { id: 's7', title: 'Business Administration Apprentice', company: 'Hilltop Services', level: 'Level 2', wage: '£12,500/yr', location: 'Liverpool', distanceMiles: 11.5, postedDate: '5 days ago', postedDateValue: '2026-07-28', closingDate: '12 Aug 2026', closingDateValue: '2026-08-12', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012351' },
  { id: 's8', title: 'Cyber Security Apprentice', company: 'Sentinel Defence', level: 'Level 4', wage: '£21,000/yr', location: 'London', distanceMiles: 4.1, postedDate: 'Today', postedDateValue: '2026-08-02', closingDate: '20 Sep 2026', closingDateValue: '2026-09-20', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012352' },
  { id: 's9', title: 'Plumbing Apprentice', company: 'FlowRight Heating', level: 'Level 3', wage: '£15,000/yr', location: 'Newcastle', distanceMiles: 7.2, postedDate: '1 day ago', postedDateValue: '2026-08-01', closingDate: '22 Aug 2026', closingDateValue: '2026-08-22', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012353' },
  { id: 's10', title: 'Data Analyst Apprentice', company: 'Quantum Insights', level: 'Level 4', wage: '£20,500/yr', location: 'London', distanceMiles: 5.4, postedDate: '3 days ago', postedDateValue: '2026-07-30', closingDate: '8 Aug 2026', closingDateValue: '2026-08-08', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012354' },
  { id: 's11', title: 'Chef Apprentice', company: 'The Copper Pan', level: 'Level 2', wage: '£13,000/yr', location: 'Edinburgh', distanceMiles: 18.6, postedDate: '6 days ago', postedDateValue: '2026-07-27', closingDate: '28 Aug 2026', closingDateValue: '2026-08-28', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012355' },
  { id: 's12', title: 'Accounting Apprentice', company: 'Ledger & Stone', level: 'Level 3', wage: '£16,800/yr', location: 'Manchester', distanceMiles: 9.1, postedDate: '2 days ago', postedDateValue: '2026-07-31', closingDate: '3 Sep 2026', closingDateValue: '2026-09-03', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012356' },
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
