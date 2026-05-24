export default function ErrorPage({ statusCode }) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        fontFamily: "system-ui, sans-serif",
        padding: "2rem",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>
          Something went wrong
        </h1>
        <p style={{ color: "#475569" }}>
          {statusCode
            ? `An error ${statusCode} occurred on this page.`
            : "An unexpected error occurred."}
        </p>
      </div>
    </main>
  );
}

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
