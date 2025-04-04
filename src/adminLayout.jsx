import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Loading from "./components/loading";
import { getCookie, decodeJWT } from "./utils/auth";
import { toast } from "react-toastify";

const Forbidden = lazy(() => import("./pages/error/Forbidden"));
const AdminDashboard = lazy(() => import("./pages/admin/dashboard"));
const ErrorPage = lazy(() => import("./pages/error/ErrorPage"));
const Users = lazy(() => import("./pages/admin/users"));
const Applications = lazy(() => import("./pages/admin/Applications"));
const Ads = lazy(() => import("./pages/admin/ads"));
const Reports = lazy(() => import("./pages/admin/Reports"));
const UserDetails = lazy(() => import("./pages/admin/UserDetails"));
const ReportDetails = lazy(() => import("./pages/admin/ReportDetails"));
const ApplicationDetails = lazy(() =>
  import("./pages/admin/ApplicationDetails")
);
const ViewAdDetails = lazy(() => import("./pages/admin/ViewAdDetails"));

const adminLayout = () => {
  const token = getCookie("token");
  if (!token) {
    console.error("No cookie named 'token' found.");
  } else {
    console.log("Token cookie received:", token);
  }
  const decodedToken = token ? decodeJWT(token) : null;
  const userRole = decodedToken?.role;
  const isTokenValid = decodedToken && decodedToken.exp * 1000 > Date.now();
  const isAdmin = token && userRole === "admin";

  const handleExpiredToken = () => {
    toast.error("Session expired. Please log in again.", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    return <Navigate to="/login" replace />;
  };

  const renderPage = (PageComponent) => {
    if (!token) {
      return <ErrorPage />; // No token, show error page
    }

    if (!isTokenValid) {
      return handleExpiredToken(); // Token expired, show session expired message and redirect
    }

    if (!isAdmin) {
      return <Forbidden role={userRole} />; // Invalid role, show forbidden page
    }

    return <PageComponent />; // Valid admin, render the page
  };

  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/dashboard" element={renderPage(AdminDashboard)} />
          <Route path="/applications" element={renderPage(Applications)} />
          <Route
            path="/applications/:id"
            element={renderPage(ApplicationDetails)}
          />
          <Route path="/users" element={renderPage(Users)} />
          <Route path="/users/:id" element={renderPage(UserDetails)} />
          <Route path="/reports/:id" element={renderPage(ReportDetails)} />
          <Route path="/ads" element={renderPage(Ads)} />
          <Route path="/ads/:id" element={renderPage(ViewAdDetails)} />
          <Route path="/reports" element={renderPage(Reports)} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default adminLayout;
