import type { Apprenticeship, ApprenticeshipsResult } from './useApprenticeships';

const SAMPLE: Apprenticeship[] = [
  { id: 's1', title: 'Software Developer Apprentice', company: 'Nebula Labs', level: 'Level 4', wage: '£18,000/yr', location: 'London', distanceMiles: 3.2, postedDate: '2 days ago', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012345' },
  { id: 's2', title: 'Carpentry Apprentice', company: 'Oakwood Joinery', level: 'Level 3', wage: '£15,500/yr', location: 'Manchester', distanceMiles: 8.4, postedDate: '1 day ago', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012346' },
  { id: 's3', title: 'Healthcare Assistant (Apprentice)', company: 'Riverside Care', level: 'Level 3', wage: '£14,800/yr', location: 'Birmingham', distanceMiles: 12.1, postedDate: '3 days ago', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012347' },
  { id: 's4', title: 'Engineering Apprentice', company: 'Atlas Manufacturing', level: 'Level 4', wage: '£19,200/yr', location: 'Leeds', distanceMiles: 6.7, postedDate: 'Today', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012348' },
  { id: 's5', title: 'Digital Marketing Apprentice', company: 'Brightwave Agency', level: 'Level 3', wage: '£16,000/yr', location: 'Bristol', distanceMiles: 14.3, postedDate: '4 days ago', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012349' },
  { id: 's6', title: 'Electrician Apprentice', company: 'Volts & Co', level: 'Level 3', wage: '£17,000/yr', location: 'Sheffield', distanceMiles: 9.8, postedDate: '2 days ago', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012350' },
  { id: 's7', title: 'Business Administration Apprentice', company: 'Hilltop Services', level: 'Level 2', wage: '£12,500/yr', location: 'Liverpool', distanceMiles: 11.5, postedDate: '5 days ago', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012351' },
  { id: 's8', title: 'Cyber Security Apprentice', company: 'Sentinel Defence', level: 'Level 4', wage: '£21,000/yr', location: 'London', distanceMiles: 4.1, postedDate: 'Today', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012352' },
  { id: 's9', title: 'Plumbing Apprentice', company: 'FlowRight Heating', level: 'Level 3', wage: '£15,000/yr', location: 'Newcastle', distanceMiles: 7.2, postedDate: '1 day ago', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012353' },
  { id: 's10', title: 'Data Analyst Apprentice', company: 'Quantum Insights', level: 'Level 4', wage: '£20,500/yr', location: 'London', distanceMiles: 5.4, postedDate: '3 days ago', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012354' },
  { id: 's11', title: 'Chef Apprentice', company: 'The Copper Pan', level: 'Level 2', wage: '£13,000/yr', location: 'Edinburgh', distanceMiles: 18.6, postedDate: '6 days ago', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012355' },
  { id: 's12', title: 'Accounting Apprentice', company: 'Ledger & Stone', level: 'Level 3', wage: '£16,800/yr', location: 'Manchester', distanceMiles: 9.1, postedDate: '2 days ago', url: 'https://www.findapprenticeship.service.gov.uk/apprenticeship/100012356' },
];

export function sampleApprenticeships(params: {
  postcode: string;
  radiusMiles: number;
  title: string;
  page: number;
  pageSize: number;
}): ApprenticeshipsResult {
  const filtered = SAMPLE.filter((job) => {
    if (typeof job.distanceMiles === 'number' && job.distanceMiles > params.radiusMiles) return false;
    if (params.title.trim()) {
      const q = params.title.trim().toLowerCase();
      if (!job.title.toLowerCase().includes(q) && !job.company.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const total = filtered.length;
  const start = (params.page - 1) * params.pageSize;
  const items = filtered.slice(start, start + params.pageSize);

  return { items, page: params.page, pageSize: params.pageSize, total };
}
