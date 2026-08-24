export const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-500', '500+', 'Custom'];

export const INDUSTRIES = [
  'Architecture & Construction',
  'Automotive',
  'E-commerce & Retail',
  'Education',
  'Gaming & Entertainment',
  'Healthcare',
  'Manufacturing',
  'Media & Advertising',
  'Real Estate',
  'Technology / Software',
  'Other',
];

export const ENTERPRISE_USES = [
  'Product visualization',
  'E-commerce catalogs',
  'Digital twins',
  'Game / film assets',
  'Architecture visualization',
  'AR / VR experiences',
  'Manufacturing & QA',
  'Training & simulation',
  'API / platform integration',
  'Other',
];

export const SCANS_PER_MONTH = ['1–50', '51–200', '201–500', '501–2,000', '2,000+'];

export const EXPECTED_USERS = ['1–5', '6–20', '21–50', '51–200', '200+'];

export const EXPECTED_PROJECTS = ['1–10', '11–50', '51–200', '201–1,000', '1,000+'];

export const STORAGE_OPTIONS = ['50 GB', '200 GB', '1 TB', '5 TB', '10 TB+', 'Custom'];

export const YES_NO = ['Yes', 'No'];

export const YES_NO_UNSURE = ['Yes', 'No', 'Not sure'];

export const SUPPORT_LEVELS = ['Standard', 'Priority', 'Dedicated'];

export const SLA_OPTIONS = ['99.0%', '99.5%', '99.9%', '99.99%', 'Custom / Discuss'];

export const BILLING_OPTIONS = ['Monthly', 'Annual', 'Multi-year'];

export const BUDGET_OPTIONS = [
  'Under $5,000',
  '$5,000–$15,000',
  '$15,000–$50,000',
  '$50,000–$100,000',
  '$100,000+',
  'Prefer not to say',
];

export const START_DATES = [
  'Immediately',
  'Within 1 month',
  '1–3 months',
  '3–6 months',
  '6+ months',
  'Not sure',
];

export const STUDENT_USES = [
  'Academic projects',
  'University research',
  'Learning 3D design',
  'Personal projects',
  'Portfolio development',
  'Thesis / dissertation',
  'Other',
];

export const GRADUATION_YEARS = (() => {
  const current = new Date().getFullYear();
  return Array.from({ length: 10 }, (_, i) => String(current - 2 + i));
})();

export const USAGE_PRESETS = [
  { label: 'Mostly 2D → 3D', twoD: 80 },
  { label: 'Balanced', twoD: 50 },
  { label: 'Mostly Prompt → 3D', twoD: 20 },
];
