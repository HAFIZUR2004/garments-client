// src/pages/ErrorPage.jsx
import React from "react";
import { Link, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-6xl font-bold text-red-500 mb-4">Oops!</h1>
      <h2 className="text-2xl font-semibold mb-2">
        {error?.statusText || "Page not found"}
      </h2>
      <p className="mb-4 text-gray-600">
        {error?.message || "The page you are looking for does not exist."}
      </p>
      <Link
        to="/"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Go Home
      </Link>
    </div>
  );
};

export default ErrorPage;
