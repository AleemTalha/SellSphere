import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Loading from "./components/loading";
import { getCookie, decodeJWT } from "./utils/auth";

import Forbidden from "./pages/error/Forbidden";
const AdminDashboard = lazy(() => import("./pages/admin/dashboard"));
const ErrorPage = lazy(() => import("./pages/error/ErrorPage"));

const adminLayout = () => {
  const token = getCookie("token");
  const decodedToken = token ? decodeJWT(token) : null;
  const userRole = decodedToken?.role;

  const isAdmin = token && userRole === "admin";

  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              isAdmin ? (
                <AdminDashboard />
              ) : token ? (
                <Forbidden role={userRole} />
              ) : (
                <Navigate to="/login" />
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
