import React, { Suspense, lazy, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
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
const ForbiddenPage = lazy(() => import("./pages/error/Forbidden"));
import Loading from "./components/loading";

function App() {
  const [userRole, setUserRole] = useState(null);
  const [token, setToken] = useState(null);

  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <ScrollToTop />
        <RouteHandler setToken={setToken} setUserRole={setUserRole} />
        <Routes>
          <Route path="/*" element={<UserLayout />} />
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
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

function RouteHandler({ setToken, setUserRole }) {
  const location = useLocation();

  useEffect(() => {
    const currentToken = getCookie("token");
    setToken(currentToken);
    const decodedToken = currentToken ? decodeJWT(currentToken) : null;
    setUserRole(decodedToken?.role);
  }, [location]);

  return null;
}

export default App;
