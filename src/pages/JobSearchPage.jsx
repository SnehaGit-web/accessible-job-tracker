import JobSearch from "../components/JobSearch/JobSearch";

function JobSearchPage({ announce }) {
  return (
    <div className="container page">
      <JobSearch announce={announce} />
    </div>
  );
}

export default JobSearchPage;
