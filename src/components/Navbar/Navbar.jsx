import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav aria-label="Main navigation" style={{ background: "#00558b", padding: "0 1.5rem" }}>
      <ul
        role="list"
        style={{ display: "flex", gap: "1rem", margin: 0, padding: "0.75rem 0", listStyle: "none" }}
      >
        <li>
          <NavLink
            to="/"
            end
            style={({ isActive }) => ({
              color: isActive ? "#ffffff" : "#cce4f4",
              fontWeight: isActive ? "700" : "400",
              textDecoration: "none",
              padding: "0.5rem 0.75rem",
              borderRadius: "4px",
              display: "inline-block",
              minHeight: "44px",
              lineHeight: "26px",
              borderBottom: isActive ? "3px solid #ffffff" : "3px solid transparent",
            })}
            aria-current={({ isActive }) => (isActive ? "page" : undefined)}
          >
            Search Jobs
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/tracker"
            style={({ isActive }) => ({
              color: isActive ? "#ffffff" : "#cce4f4",
              fontWeight: isActive ? "700" : "400",
              textDecoration: "none",
              padding: "0.5rem 0.75rem",
              borderRadius: "4px",
              display: "inline-block",
              minHeight: "44px",
              lineHeight: "26px",
              borderBottom: isActive ? "3px solid #ffffff" : "3px solid transparent",
            })}
          >
            My Applications
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
