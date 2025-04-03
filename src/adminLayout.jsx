import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Loading from "./components/loading";
import { getCookie, decodeJWT } from "./utils/auth";

import Forbidden from "./pages/error/Forbidden";
const AdminDashboard = lazy(() => import("./pages/admin/dashboard"));
const ErrorPage = lazy(() => import("./pages/error/ErrorPage"));
const Users = lazy(() => import("./pages/admin/users"));
const Applications = lazy(() => import("./pages/admin/Applications"));
const Ads = lazy(() => import("./pages/admin/ads"));
const Reports = lazy(() => import("./pages/admin/Reports"));

const adminLayout = () => {
  const token = getCookie("token");
  const decodedToken = token ? decodeJWT(token) : null;
  const userRole = decodedToken?.role;
  const isAdmin = token && userRole === "admin";

  const renderPage = (PageComponent) => {
    if (!token) {
      return <Navigate to="/error" replace />;
    }
    if (!userRole || userRole !== "admin") {
      return <Forbidden role={userRole} />;
    }
    return <PageComponent />;
  };

  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/dashboard" element={renderPage(AdminDashboard)} />
          <Route
            path="/applications"
            element={
              !token ? (
                <Navigate to="/error" replace />
              ) : !userRole || userRole !== "admin" ? (
                <Forbidden role={userRole} />
              ) : (
                <Applications />
              )
            }
          />
          <Route
            path="/users"
            element={
              !token ? (
                <Navigate to="/error" replace />
              ) : !userRole || userRole !== "admin" ? (
                <Forbidden role={userRole} />
              ) : (
                <Users />
              )
            }
          />
          <Route
            path="/ads"
            element={
              !token ? (
                <Navigate to="/error" replace />
              ) : !userRole || userRole !== "admin" ? (
                <Forbidden role={userRole} />
              ) : (
                <Ads />
              )
            }
          />
          <Route
            path="/reports"
            element={
              !token ? (
                <Navigate to="/error" replace />
              ) : !userRole || userRole !== "admin" ? (
                <Forbidden role={userRole} />
              ) : (
                <Reports />
              )
            }
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default adminLayout;
