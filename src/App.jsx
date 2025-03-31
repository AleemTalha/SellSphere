import React, { Suspense, lazy, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import UserLayout from "./userLayout";
import ScrollToTop from "./utils/scroll";
import AdminLayout from "./adminLayout";
import { getCookie, decodeJWT } from "./utils/auth";

const Login = lazy(() => import("./pages/user/login"));
const ErrorPage = lazy(() => import("./pages/error/ErrorPage"));
import Loading from "./components/loading";

function App() {
  const token = getCookie("token");
  const decodedToken = token ? decodeJWT(token) : null;
  const userRole = decodedToken?.role;

  return (
    <Router>
      <Suspense fallback={<Loading />}>
          <ScrollToTop />
        <Routes>
          <Route
            path="/login"
            element={
              token ? (
                userRole === "user" ? (
                  <Navigate to="/" />
                ) : userRole === "admin" ? (
                  <Navigate to="/admin/dashboard" />
                ) : (
                  <Navigate to="/" />
                )
              ) : (
                <Login />
              )
            }
          />
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="/*" element={<UserLayout />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
