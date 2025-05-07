import React, { useState, useEffect } from "react";

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error) => {
      console.error("ErrorBoundary caught:", error);
      setHasError(true);
    };
    window.addEventListener("error", errorHandler);
    return () => window.removeEventListener("error", errorHandler);
  }, []);

  if (hasError) {
    return (
      <div className="text-center text-red-500 p-8">
        <h2>An error occurred.</h2>
        <p>Please refresh the page or try again later.</p>
      </div>
    );
  }

  return children;
};

export default ErrorBoundary;