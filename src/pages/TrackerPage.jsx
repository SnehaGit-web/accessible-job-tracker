import ApplicationTracker from "../components/ApplicationTracker/ApplicationTracker";

function TrackerPage({ announce }) {
  return (
    <div className="container page">
      <ApplicationTracker announce={announce} />
    </div>
  );
}

export default TrackerPage;
