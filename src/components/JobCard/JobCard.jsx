import { useState } from "react";

// WCAG 2.1 AAA compliant Job Card
function JobCard({ job, announce }) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved((prev) => !prev);
    announce(saved ? `${job.company} removed from saved jobs` : `${job.company} saved to your tracker`);
  };

  return (
    <article
      aria-label={`${job.title} at ${job.company}`}
      style={{
        background: "#ffffff",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        padding: "1.25rem 1.5rem",
        marginBottom: "1rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
      }}
    >
      {/* Job title links to original posting */}
      <h3 style={{ margin: "0 0 0.25rem", fontSize: "1.1rem" }}>
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#00558b", textDecoration: "underline" }}
          aria-label={`${job.title} at ${job.company} — opens in new tab`}
        >
          {job.title}
        </a>
      </h3>

      <p style={{ margin: "0 0 0.5rem", color: "#1a1a1a", fontWeight: "600" }}>
        {job.company}
      </p>

      <p style={{ margin: "0 0 0.25rem", color: "#595959", fontSize: "0.9375rem" }}>
        📍 {job.location}
      </p>

      {job.salary && (
        <p style={{ margin: "0 0 0.75rem", color: "#595959", fontSize: "0.9375rem" }}>
          💰 {job.salary}
        </p>
      )}

      {job.description && (
        <p
          style={{
            margin: "0 0 1rem",
            color: "#595959",
            fontSize: "0.9375rem",
            lineHeight: "1.6",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {job.description}
        </p>
      )}

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            minHeight: "44px",
            padding: "0.5rem 1.25rem",
            background: "#00558b",
            color: "#ffffff",
            borderRadius: "4px",
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "0.9375rem",
          }}
          aria-label={`View full job posting for ${job.title} at ${job.company}`}
        >
          View Job
        </a>

        <button
          onClick={handleSave}
          aria-pressed={saved}
          style={{
            display: "inline-flex",
            alignItems: "center",
            minHeight: "44px",
            padding: "0.5rem 1.25rem",
            background: "transparent",
            color: "#00558b",
            border: "2px solid #00558b",
            borderRadius: "4px",
            fontWeight: "600",
            fontSize: "0.9375rem",
            cursor: "pointer",
          }}
        >
          {saved ? "✓ Saved" : "Save Job"}
        </button>
      </div>

      {job.postedDate && (
        <p style={{ margin: "0.75rem 0 0", color: "#595959", fontSize: "0.875rem" }}>
          Posted:{" "}
          <time dateTime={job.postedDate}>
            {new Date(job.postedDate).toLocaleDateString("en-CA", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
        </p>
      )}
    </article>
  );
}

export default JobCard;
