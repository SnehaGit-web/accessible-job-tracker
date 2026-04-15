import { useState, useRef, useId, useEffect } from "react";
import { searchJobs, MOCK_JOBS } from "../../api/jobsApi";
import JobCard from "../JobCard/JobCard";

const IS_GITHUB_PAGES = window.location.hostname.includes('github.io');
const IS_MOCK = !process.env.REACT_APP_ADZUNA_APP_ID || !process.env.REACT_APP_ADZUNA_APP_KEY;

function JobSearch({ announce }) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const resultsRef = useRef(null);
  const queryId = useId();
  const locationId = useId();
  const errorId = useId();

  // Auto-load all mock jobs on first render when no API keys
  useEffect(() => {
  if (IS_MOCK && !IS_GITHUB_PAGES) {
    setResults(MOCK_JOBS);
    setHasSearched(true);
  }
}, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim() && IS_MOCK) {
      // Reset to show all mock jobs if query is cleared
      setResults(MOCK_JOBS);
      setHasSearched(true);
      announce(`Showing all ${MOCK_JOBS.length} demo jobs`);
      return;
    }
    if (!query.trim()) {
      setError("Please enter a job title or keyword to search.");
      return;
    }
    setError("");
    setIsLoading(true);
    setHasSearched(true);
    announce("Searching for jobs, please wait...");

    try {
      const jobs = await searchJobs(query, location);
      setResults(jobs);
      announce(
        jobs.length > 0
          ? `Search complete. Found ${jobs.length} jobs for ${query}.`
          : `Search complete. No jobs found for ${query}. Try different keywords.`
      );
      setTimeout(() => resultsRef.current?.focus(), 100);
    } catch (err) {
      setError("Unable to fetch jobs. Please check your connection and try again.");
      announce("Search failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section aria-labelledby="search-heading">
      <h1 id="search-heading">Find Accessible Job Opportunities</h1>
      <p style={{ color: "#595959", marginBottom: "1.5rem" }}>
        Search job listings and save the ones you want to track.
      </p>

      {/* Demo mode notice */}
      {IS_MOCK && !IS_GITHUB_PAGES && (
        <div
          role="note"
          style={{
            background: "#fef9c3",
            border: "2px solid #713f12",
            borderRadius: "6px",
            padding: "0.75rem 1rem",
            marginBottom: "1.5rem",
            color: "#713f12",
            fontSize: "0.9375rem",
          }}
        >
          <strong>Demo mode:</strong> Showing sample job data. To search live jobs, add your free{" "}
          <a href="https://developer.adzuna.com/" target="_blank" rel="noopener noreferrer" style={{ color: "#713f12" }}>
            Adzuna API keys
          </a>{" "}
          to your <code>.env</code> file.
        </div>
      )}

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        noValidate
        style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "600px", marginBottom: "2rem" }}
      >
        <div>
          <label htmlFor={queryId} style={{ display: "block", fontWeight: "600", marginBottom: "0.35rem" }}>
            Job title or keywords
            {!IS_MOCK && <><span aria-hidden="true"> *</span><span className="sr-only"> (required)</span></>}
          </label>
          <input
            id={queryId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={IS_MOCK ? "Filter by keyword e.g. React, Accessibility" : "e.g. Front-End Developer, React"}
            autoComplete="off"
            aria-required={!IS_MOCK}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? errorId : undefined}
          />
        </div>

        <div>
          <label htmlFor={locationId} style={{ display: "block", fontWeight: "600", marginBottom: "0.35rem" }}>
            Location <span style={{ fontWeight: "400", color: "#595959" }}>(optional)</span>
          </label>
          <input
            id={locationId}
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Toronto, ON or Remote"
            autoComplete="address-level2"
          />
        </div>

        {error && (
          <div
            id={errorId}
            role="alert"
            style={{ color: "#b91c1c", fontSize: "0.9375rem", display: "flex", alignItems: "center", gap: "0.35rem" }}
          >
            <span aria-hidden="true">⚠</span> {error}
          </div>
        )}

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button type="submit" className="btn btn-primary" aria-busy={isLoading} disabled={isLoading}>
            {isLoading ? "Searching..." : IS_MOCK ? "Filter Jobs" : "Search Jobs"}
          </button>
          {IS_MOCK && query && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => { setQuery(""); setLocation(""); setResults(MOCK_JOBS); announce("Showing all demo jobs"); }}
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Results */}
      {hasSearched && (
        <section aria-labelledby="results-heading" aria-live="polite">
          <h2
            id="results-heading"
            ref={resultsRef}
            tabIndex="-1"
            style={{ outline: "none", marginBottom: "1rem" }}
          >
            {isLoading
              ? "Loading results..."
              : results.length > 0
              ? `${results.length} Job${results.length !== 1 ? "s" : ""} Available`
              : `No results found`}
          </h2>

          {!isLoading && results.length === 0 && (
            <p style={{ color: "#595959" }}>
              No jobs matched your search. Try broader keywords like{" "}
              <strong>developer</strong>, <strong>react</strong>, or <strong>accessibility</strong>.
            </p>
          )}

          <ul style={{ listStyle: "none", padding: 0, margin: 0 }} aria-label="Job listings">
            {results.map((job) => (
              <li key={job.id}>
                <JobCard job={job} announce={announce} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
}

export default JobSearch;
