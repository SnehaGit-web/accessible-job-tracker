// WCAG 2.4.1 (A) - Bypass Blocks
// Allows keyboard users to skip repetitive navigation

function SkipNav({ href = "#main-content" }) {
  return (
    <a href={href} className="skip-nav">
      Skip to main content
    </a>
  );
}

export default SkipNav;
