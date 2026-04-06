// API integration for job search
// Uses Adzuna public jobs API via React dev proxy (avoids CORS)
// Docs: https://developer.adzuna.com/
//
// HOW THE PROXY WORKS:
// React's dev server forwards requests starting with /api/adzuna
// to https://api.adzuna.com — bypassing browser CORS restrictions.
// This is configured via "proxy" in package.json.
//
// If no API keys are set in .env, mock data is returned automatically.

const APP_ID = process.env.REACT_APP_ADZUNA_APP_ID;
const APP_KEY = process.env.REACT_APP_ADZUNA_APP_KEY;
const COUNTRY = "ca"; // Canada

const HAS_API_KEYS = APP_ID && APP_KEY;

/**
 * Search for jobs.
 * Uses React dev proxy to avoid CORS issues with Adzuna.
 * Falls back to filtered mock data if API keys are not configured.
 */
export async function searchJobs(query, location = "", page = 1) {
  if (!HAS_API_KEYS) {
    return getMockResults(query, location);
  }

  const params = new URLSearchParams({
    app_id: APP_ID,
    app_key: APP_KEY,
    results_per_page: 20,
    what: query,
    where: location,
  });

  // Use relative URL — React proxy forwards this to https://api.adzuna.com
  const response = await fetch(
    `/v1/api/jobs/${COUNTRY}/search/${page}?${params}`
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();

  return (data.results || []).map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company?.display_name || "Company not listed",
    location: job.location?.display_name || "Location not listed",
    salary: formatSalary(job.salary_min, job.salary_max),
    description: job.description,
    url: job.redirect_url,
    postedDate: job.created,
    category: job.category?.label,
  }));
}

function formatSalary(min, max) {
  if (!min && !max) return "Salary not listed";
  const fmt = (n) =>
    new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    }).format(n);
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max)}`;
}

function getMockResults(query, location) {
  const q = query.toLowerCase();
  const loc = location.toLowerCase();
  const results = MOCK_JOBS.filter((job) => {
    const matchesQuery =
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.description.toLowerCase().includes(q) ||
      job.category.toLowerCase().includes(q);
    const matchesLocation = !loc || job.location.toLowerCase().includes(loc);
    return matchesQuery && matchesLocation;
  });
  return new Promise((resolve) => setTimeout(() => resolve(results), 600));
}

export const MOCK_JOBS = [
  {
    id: "1",
    title: "Front-End Developer",
    company: "EnabledTalent",
    location: "Greater Sudbury, ON (Remote)",
    salary: "CA$45,000 – CA$50,000",
    description: "Build accessible, WCAG 2.1 AAA compliant front-end pages for a disability-focused hiring platform. Work with React, HTML, CSS, and JavaScript. Test with screen readers and keyboard-only navigation.",
    url: "https://www.f6s.com/enabledtalent",
    postedDate: "2026-02-05",
    category: "IT Jobs",
  },
  {
    id: "2",
    title: "React Developer",
    company: "Inclusive Tech Co",
    location: "Toronto, ON (Hybrid)",
    salary: "CA$70,000 – CA$90,000",
    description: "Join our team building inclusive digital products using React and modern accessibility tooling. Experience with WCAG and ARIA required.",
    url: "https://example.com/job/2",
    postedDate: "2026-03-20",
    category: "IT Jobs",
  },
  {
    id: "3",
    title: "Full Stack Developer",
    company: "AccessAbility Solutions",
    location: "Remote — Canada",
    salary: "CA$80,000 – CA$100,000",
    description: "Full stack role with a focus on accessible UI. PHP, JavaScript, React, and MySQL. 3+ years experience required.",
    url: "https://example.com/job/3",
    postedDate: "2026-03-28",
    category: "IT Jobs",
  },
  {
    id: "4",
    title: "WordPress Developer",
    company: "Digital Reach Agency",
    location: "Windsor, ON (Remote)",
    salary: "CA$55,000 – CA$65,000",
    description: "Build and maintain WordPress websites for non-profit and public sector clients. Accessibility and SEO experience preferred.",
    url: "https://example.com/job/4",
    postedDate: "2026-03-15",
    category: "IT Jobs",
  },
  {
    id: "5",
    title: "UI/UX Developer",
    company: "Barrier-Free Digital",
    location: "Ottawa, ON (Hybrid)",
    salary: "CA$65,000 – CA$80,000",
    description: "Design and build accessible user interfaces. Deep knowledge of WCAG 2.1, ARIA, and inclusive design principles required.",
    url: "https://example.com/job/5",
    postedDate: "2026-04-01",
    category: "IT Jobs",
  },
  {
    id: "6",
    title: "JavaScript Developer",
    company: "OpenWeb Canada",
    location: "Remote — Canada",
    salary: "CA$75,000 – CA$95,000",
    description: "Write modern, accessible JavaScript for a public-facing web platform. Experience with ES6+, React, and API integration required.",
    url: "https://example.com/job/6",
    postedDate: "2026-03-10",
    category: "IT Jobs",
  },
  {
    id: "7",
    title: "Accessibility Specialist",
    company: "Government of Ontario",
    location: "Toronto, ON",
    salary: "CA$70,000 – CA$85,000",
    description: "Audit and remediate digital products for AODA and WCAG 2.1 AA/AAA compliance. Experience with NVDA, JAWS, and VoiceOver required.",
    url: "https://example.com/job/7",
    postedDate: "2026-03-25",
    category: "IT Jobs",
  },
  {
    id: "8",
    title: "Frontend Engineer",
    company: "NorthStar Tech",
    location: "Waterloo, ON (Remote)",
    salary: "CA$90,000 – CA$110,000",
    description: "Build fast, accessible, and scalable frontend systems using React and Next.js. Work closely with design and backend teams.",
    url: "https://example.com/job/8",
    postedDate: "2026-04-02",
    category: "IT Jobs",
  },
];
