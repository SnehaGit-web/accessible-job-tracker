import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SkipNav from "./components/SkipNav/SkipNav";
import Navbar from "./components/Navbar/Navbar";
import JobSearchPage from "./pages/JobSearchPage";
import TrackerPage from "./pages/TrackerPage";
import "./styles/global.css";

// Accessibility: Mount axe-core in development for real-time a11y feedback
// Uncomment after running: npm install @axe-core/react
// if (process.env.NODE_ENV !== "production") {
//   const axe = require("@axe-core/react");
//   const ReactDOM = require("react-dom");
//   axe(React, ReactDOM, 1000);
// }

function App() {
  const [announceMessage, setAnnounceMessage] = useState("");

  // Live region announcer for screen readers
  const announce = (message) => {
    setAnnounceMessage("");
    setTimeout(() => setAnnounceMessage(message), 100);
  };

  return (
    <Router>
      {/* WCAG 2.4.1 - Skip navigation link */}
      <SkipNav href="#main-content" />

      {/* ARIA live region for dynamic announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announceMessage}
      </div>

      <Navbar />

      <main id="main-content" tabIndex="-1">
        <Routes>
          <Route path="/" element={<JobSearchPage announce={announce} />} />
          <Route path="/tracker" element={<TrackerPage announce={announce} />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
