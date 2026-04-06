import { useState, useId, useRef } from "react";
import Modal from "../Modal/Modal";

const STATUS_OPTIONS = ["Applied", "Interview", "Offer", "Rejected"];

const EMPTY_FORM = {
  company: "",
  role: "",
  date: new Date().toISOString().split("T")[0],
  status: "Applied",
  notes: "",
  url: "",
};

const STATUS_COLORS = {
  Applied:   { bg: "#dbeafe", color: "#1e3a8a" },
  Interview: { bg: "#fef9c3", color: "#713f12" },
  Offer:     { bg: "#dcfce7", color: "#14532d" },
  Rejected:  { bg: "#fee2e2", color: "#7f1d1d" },
};

function ApplicationTracker({ announce }) {
  const [applications, setApplications] = useState([
    { id: 1, company: "EnabledTalent", role: "Front-End Developer", date: "2026-04-01", status: "Applied", notes: "Great mission-driven company", url: "" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [filterStatus, setFilterStatus] = useState("All");

  const addBtnRef = useRef(null);
  const companyId = useId();
  const roleId = useId();
  const dateId = useId();
  const statusId = useId();
  const notesId = useId();
  const urlId = useId();

  const openModal = () => { setForm(EMPTY_FORM); setFormErrors({}); setIsModalOpen(true); };
  const closeModal = () => setIsModalOpen(false);

  const validate = () => {
    const errors = {};
    if (!form.company.trim()) errors.company = "Company name is required.";
    if (!form.role.trim()) errors.role = "Job title is required.";
    if (!form.date) errors.date = "Date applied is required.";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      announce("Form has errors. Please fix them and try again.");
      return;
    }
    setApplications((prev) => [{ ...form, id: Date.now() }, ...prev]);
    announce(`${form.company} added to your tracker.`);
    closeModal();
  };

  const handleField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const updateStatus = (id, newStatus) => {
    const app = applications.find((a) => a.id === id);
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
    announce(`${app.company} status updated to ${newStatus}`);
  };

  const deleteApplication = (id) => {
    const app = applications.find((a) => a.id === id);
    if (window.confirm(`Remove ${app.company} — ${app.role} from your tracker?`)) {
      setApplications((prev) => prev.filter((a) => a.id !== id));
      announce(`${app.company} removed from tracker.`);
    }
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
    announce(`Sorted by ${key}, ${direction === "asc" ? "ascending" : "descending"}`);
  };

  const getSortIcon = (key) => sortConfig.key !== key ? "↕" : sortConfig.direction === "asc" ? "↑" : "↓";
  const getSortAriaLabel = (key, label) => {
    if (sortConfig.key !== key) return `Sort by ${label}`;
    return `Sorted by ${label} ${sortConfig.direction === "asc" ? "ascending, activate to sort descending" : "descending, activate to sort ascending"}`;
  };

  const filtered = applications
    .filter((a) => filterStatus === "All" || a.status === filterStatus)
    .sort((a, b) => {
      const dir = sortConfig.direction === "asc" ? 1 : -1;
      return a[sortConfig.key] > b[sortConfig.key] ? dir : -dir;
    });

  return (
    <section aria-labelledby="tracker-heading">

      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        <h1 id="tracker-heading" style={{ margin: 0 }}>My Job Applications</h1>
        <button ref={addBtnRef} onClick={openModal} className="btn btn-primary" aria-haspopup="dialog">
          + Add Application
        </button>
      </div>

      {/* Filter Buttons */}
      <div role="group" aria-label="Filter applications by status" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {["All", ...STATUS_OPTIONS].map((s) => {
          const count = s === "All" ? applications.length : applications.filter((a) => a.status === s).length;
          const colors = STATUS_COLORS[s] || { bg: "#f3f4f6", color: "#1a1a1a" };
          const isActive = filterStatus === s;
          return (
            <button
              key={s}
              onClick={() => { setFilterStatus(s); announce(`Showing ${s} applications`); }}
              aria-pressed={isActive}
              style={{
                background: isActive ? colors.bg : "#f3f4f6",
                color: isActive ? colors.color : "#595959",
                border: `2px solid ${isActive ? colors.color : "#d1d5db"}`,
                borderRadius: "100px",
                padding: "0.35rem 1rem",
                minHeight: "44px",
                fontWeight: "600",
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
            >
              {s} ({count})
            </button>
          );
        })}
      </div>

      {/* Screen reader live count */}
      <p className="sr-only" aria-live="polite">
        Showing {filtered.length} of {applications.length} applications
      </p>

      {/* Table */}
      {filtered.length > 0 ? (
        <div style={{ overflowX: "auto" }} role="region" aria-label="Applications table">
          <table aria-label="Job applications" style={{ width: "100%", borderCollapse: "collapse", minWidth: "640px" }}>
            <thead>
              <tr style={{ background: "#f5f7fa" }}>
                {[["company", "Company"], ["role", "Role"], ["date", "Date Applied"]].map(([key, label]) => (
                  <th key={key} scope="col" style={{ padding: "0.75rem 1rem", textAlign: "left", borderBottom: "2px solid #d1d5db" }}>
                    <button
                      onClick={() => handleSort(key)}
                      aria-label={getSortAriaLabel(key, label)}
                      aria-sort={sortConfig.key === key ? (sortConfig.direction === "asc" ? "ascending" : "descending") : "none"}
                      style={{ background: "none", border: "none", fontWeight: "700", fontSize: "0.9375rem", cursor: "pointer", color: "#1a1a1a", display: "flex", alignItems: "center", gap: "0.35rem", minHeight: "44px", padding: "0 4px" }}
                    >
                      {label} <span aria-hidden="true" style={{ color: "#595959" }}>{getSortIcon(key)}</span>
                    </button>
                  </th>
                ))}
                <th scope="col" style={{ padding: "0.75rem 1rem", textAlign: "left", borderBottom: "2px solid #d1d5db" }}>Status</th>
                <th scope="col" style={{ padding: "0.75rem 1rem", textAlign: "left", borderBottom: "2px solid #d1d5db" }}>Notes</th>
                <th scope="col" style={{ padding: "0.75rem 1rem", borderBottom: "2px solid #d1d5db" }}><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app, i) => (
                <tr key={app.id} style={{ background: i % 2 === 0 ? "#ffffff" : "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "0.85rem 1rem", fontWeight: "600", color: "#1a1a1a" }}>
                    {app.url
                      ? <a href={app.url} target="_blank" rel="noopener noreferrer" style={{ color: "#00558b" }}>{app.company}</a>
                      : app.company}
                  </td>
                  <td style={{ padding: "0.85rem 1rem", color: "#1a1a1a" }}>{app.role}</td>
                  <td style={{ padding: "0.85rem 1rem", color: "#595959", whiteSpace: "nowrap" }}>
                    <time dateTime={app.date}>
                      {new Date(app.date).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}
                    </time>
                  </td>
                  <td style={{ padding: "0.85rem 1rem" }}>
                    <label htmlFor={`status-${app.id}`} className="sr-only">Status for {app.company} {app.role}</label>
                    <select
                      id={`status-${app.id}`}
                      value={app.status}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      style={{ minWidth: "130px", padding: "0.35rem 0.5rem", border: "2px solid #767676", borderRadius: "4px", fontWeight: "600", fontSize: "0.875rem", background: STATUS_COLORS[app.status]?.bg || "#f3f4f6", color: STATUS_COLORS[app.status]?.color || "#1a1a1a", minHeight: "44px" }}
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: "0.85rem 1rem", color: "#595959", fontSize: "0.9375rem" }}>
                    {app.notes || <span aria-label="No notes">—</span>}
                  </td>
                  <td style={{ padding: "0.85rem 1rem" }}>
                    <button
                      onClick={() => deleteApplication(app.id)}
                      aria-label={`Remove ${app.company} ${app.role} from tracker`}
                      style={{ background: "transparent", color: "#b91c1c", border: "2px solid #b91c1c", borderRadius: "4px", padding: "0.35rem 0.75rem", minHeight: "44px", fontWeight: "600", fontSize: "0.875rem", cursor: "pointer" }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div role="status" style={{ padding: "2rem", textAlign: "center", background: "#f5f7fa", borderRadius: "8px", color: "#595959" }}>
          <p style={{ marginBottom: "1rem" }}>No applications match this filter.</p>
          <button className="btn btn-secondary" onClick={() => setFilterStatus("All")}>Show All Applications</button>
        </div>
      )}

      {/* Add Application Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Add New Application" triggerRef={addBtnRef}>
        <form onSubmit={handleSubmit} noValidate>

          {/* Company */}
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor={companyId} style={{ display: "block", fontWeight: "600", marginBottom: "0.35rem" }}>
              Company <span aria-hidden="true">*</span><span className="sr-only"> (required)</span>
            </label>
            <input id={companyId} type="text" value={form.company} onChange={(e) => handleField("company", e.target.value)}
              aria-required="true" aria-invalid={!!formErrors.company} aria-describedby={formErrors.company ? `${companyId}-err` : undefined} autoComplete="organization" />
            {formErrors.company && <p id={`${companyId}-err`} role="alert" style={{ color: "#b91c1c", fontSize: "0.875rem", margin: "0.25rem 0 0" }}>⚠ {formErrors.company}</p>}
          </div>

          {/* Role */}
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor={roleId} style={{ display: "block", fontWeight: "600", marginBottom: "0.35rem" }}>
              Job Title <span aria-hidden="true">*</span><span className="sr-only"> (required)</span>
            </label>
            <input id={roleId} type="text" value={form.role} onChange={(e) => handleField("role", e.target.value)}
              aria-required="true" aria-invalid={!!formErrors.role} aria-describedby={formErrors.role ? `${roleId}-err` : undefined} autoComplete="off" />
            {formErrors.role && <p id={`${roleId}-err`} role="alert" style={{ color: "#b91c1c", fontSize: "0.875rem", margin: "0.25rem 0 0" }}>⚠ {formErrors.role}</p>}
          </div>

          {/* Date */}
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor={dateId} style={{ display: "block", fontWeight: "600", marginBottom: "0.35rem" }}>
              Date Applied <span aria-hidden="true">*</span><span className="sr-only"> (required)</span>
            </label>
            <input id={dateId} type="date" value={form.date} onChange={(e) => handleField("date", e.target.value)}
              aria-required="true" aria-invalid={!!formErrors.date} style={{ maxWidth: "200px" }} />
            {formErrors.date && <p id={`${dateId}-err`} role="alert" style={{ color: "#b91c1c", fontSize: "0.875rem", margin: "0.25rem 0 0" }}>⚠ {formErrors.date}</p>}
          </div>

          {/* Status */}
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor={statusId} style={{ display: "block", fontWeight: "600", marginBottom: "0.35rem" }}>Status</label>
            <select id={statusId} value={form.status} onChange={(e) => handleField("status", e.target.value)} style={{ maxWidth: "200px" }}>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* URL */}
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor={urlId} style={{ display: "block", fontWeight: "600", marginBottom: "0.35rem" }}>Job Posting URL (optional)</label>
            <input id={urlId} type="url" value={form.url} onChange={(e) => handleField("url", e.target.value)} placeholder="https://example.com/job" autoComplete="off" />
          </div>

          {/* Notes */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label htmlFor={notesId} style={{ display: "block", fontWeight: "600", marginBottom: "0.35rem" }}>Notes (optional)</label>
            <textarea id={notesId} value={form.notes} onChange={(e) => handleField("notes", e.target.value)}
              rows={3} style={{ resize: "vertical", minHeight: "80px", width: "100%", padding: "0.5rem", border: "2px solid #767676", borderRadius: "4px", fontFamily: "inherit", fontSize: "1rem" }}
              placeholder="Salary range, recruiter name, interview notes..." />
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <button type="button" onClick={closeModal} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">Save Application</button>
          </div>

        </form>
      </Modal>
    </section>
  );
}

export default ApplicationTracker;
