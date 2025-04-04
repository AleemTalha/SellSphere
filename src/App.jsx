import React, { Suspense, lazy } from "react";
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
const ForbiddenPage = lazy(() => import("./pages/error/Forbidden"));
import Loading from "./components/loading";

function App() {
  const token = getCookie("token");
  if (!token) {
    console.error("No cookie named 'token' found.");
  } else {
    console.log("Token cookie received:", token);
  }
  const decodedToken = token ? decodeJWT(token) : null;
  const isTokenValid = decodedToken && decodedToken.exp * 1000 > Date.now();
  const userRole = isTokenValid ? decodedToken.role : null;

  const ProtectedRoute = ({ children }) => {
    if (!token) {
      return <ErrorPage />;
    }
    if (!isTokenValid) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const LoginRedirect = () => {
    if (isTokenValid) {
      return userRole === "admin" ? (
        <Navigate to="/admin/dashboard" replace />
      ) : (
        <Navigate to="/" replace />
      );
    }
    return <Login />;
  };

  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <ScrollToTop />
        <Routes>
          <Route path="/*" element={<UserLayout />} />
          <Route path="/login" element={<LoginRedirect />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
