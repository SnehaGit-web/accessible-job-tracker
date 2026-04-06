import { useState, useRef, useId } from "react";
import { searchJobs } from "../../api/jobsApi";
import JobCard from "../JobCard/JobCard";

// WCAG 2.1 AAA compliant Job Search component
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

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setError("Please enter a job title or keyword to search.");
      return;
    }

    setError("");
    setIsLoading(true);
    setHasSearched(true);

    // Announce to screen readers that search is in progress
    announce("Searching for jobs, please wait...");

    try {
      const jobs = await searchJobs(query, location);
      setResults(jobs);
      // WCAG 4.1.3 - Status Messages
      announce(
        jobs.length > 0
          ? `Search complete. Found ${jobs.length} jobs for ${query}.`
          : `Search complete. No jobs found for ${query}. Try different keywords.`
      );
      // Move focus to results for keyboard users
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
      <p className="text-muted">
        Search thousands of jobs. All results link to original postings.
      </p>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        noValidate
        aria-describedby={error ? errorId : undefined}
      >
        <div className="form-group">
          <label htmlFor={queryId}>
            Job title or keywords
            <span aria-hidden="true"> *</span>
            <span className="sr-only"> (required)</span>
          </label>
          <input
            id={queryId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Front-End Developer, React"
            autoComplete="off"
            aria-required="true"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? errorId : undefined}
          />
        </div>

        <div className="form-group">
          <label htmlFor={locationId}>Location (optional)</label>
          <input
            id={locationId}
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Toronto, ON or Remote"
            autoComplete="address-level2"
          />
        </div>

        {/* WCAG 3.3.1 - Error Identification */}
        {error && (
          <div
            id={errorId}
            role="alert"
            className="field-error"
            aria-live="assertive"
          >
            <span aria-hidden="true">⚠</span>
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary search-btn"
          aria-busy={isLoading}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span aria-hidden="true">⏳</span>
              <span>Searching...</span>
            </>
          ) : (
            "Search Jobs"
          )}
        </button>
      </form>

      {/* Results Region */}
      {hasSearched && (
        <section
          aria-labelledby="results-heading"
          aria-live="polite"
        >
          {/* Focusable results heading for keyboard navigation */}
          <h2
            id="results-heading"
            ref={resultsRef}
            tabIndex="-1"
            style={{ outline: "none" }}
          >
            {isLoading
              ? "Loading results..."
              : results.length > 0
              ? `${results.length} Jobs Found`
              : "No Results Found"}
          </h2>

          {!isLoading && results.length === 0 && (
            <p>
              No jobs matched your search. Try broader keywords or a different
              location.
            </p>
          )}

          {/* WCAG 1.3.1 - List structure for screen readers */}
          <ul className="job-list" aria-label="Job search results">
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
