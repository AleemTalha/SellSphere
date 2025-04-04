import React, { Suspense, lazy, useEffect, useState } from "react";
import {
  Routes,
  Route,
  Outlet,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Loading from "./components/loading";
import ContactButton from "./components/ContactButton/ContactButton";

const Dashboard = lazy(() => import("./pages/user/dashboard/Dashboard"));
const Forbidden = lazy(() => import("./pages/error/Forbidden"));
const PostAd = lazy(() => import("./pages/user/postAd/postAd"));
const ForgotEmail = lazy(() => import("./pages/user/forgotPassword/forgot"));
const Policy = lazy(() => import("./pages/user/policy/Policy"));
const Contact = lazy(() => import("./pages/user/contact/Contact"));
const FAQs = lazy(() => import("./pages/user/FAQs/faq"));
const Profile = lazy(() => import("./pages/user/profile/Profile"));
const About = lazy(() => import("./pages/user/About/About"));
const ItemDetails = lazy(() => import("./pages/user/itemsDetail/ItemDetails"));
const Unblocked = lazy(() =>
  import("./pages/user/Block-Application/application")
);
const CategoriesSearching = lazy(() =>
  import("./pages/user/CategoriesSearchingPage")
);
const ErrorPage = lazy(() => import("./pages/error/ErrorPage"));

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
  return null;
};

const decodeJWT = (token) => {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }
  const base64Url = parts[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const decodedData = JSON.parse(atob(base64));
  return decodedData;
};

const userLayout = () => {
  const [token, setToken] = useState(getCookie("token"));
  const [userRole, setUserRole] = useState(
    token ? decodeJWT(token)?.role : null
  );
  const [sessionExpired, setSessionExpired] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const updateToken = () => {
      const newToken = getCookie("token");
      if (!newToken) {
        if (token) {
          setSessionExpired(true);
          setTimeout(() => {
            setSessionExpired(false);
            navigate("/login");
          }, 3000);
        }
        setToken(null);
        setUserRole(null);
      } else if (newToken !== token) {
        setToken(newToken);
        setUserRole(decodeJWT(newToken)?.role);
      }
    };

    updateToken();
  }, [location]);

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setToken(null);
    setUserRole(null);
    navigate("/login");
  };

  const isUser = token && userRole === "user";
  const isAdmin = token && userRole === "admin";

  return (
    <div>
      {sessionExpired && (
        <div className="session-expired-message">
          Session expired. Redirecting to login...
        </div>
      )}
      <Suspense fallback={<Loading />}>
        <ContactButton />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/post-ads"
            element={
              isUser ? (
                <PostAd />
              ) : token ? (
                <Forbidden role={userRole} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/profile/:id"
            element={
              isUser ? (
                <Profile onLogout={handleLogout} />
              ) : token ? (
                <Forbidden role={userRole} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/category/:category/:subcategory?"
            element={
              isUser ? (
                <CategoriesSearching />
              ) : token ? (
                <Forbidden role={userRole} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/item-id/:id/:category/"
            element={
              isUser ? (
                <ItemDetails />
              ) : token ? (
                <Forbidden role={userRole} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/forgot-password"
            element={!token ? <ForgotEmail /> : <Forbidden role={userRole} />}
          />
          <Route path="/policy" element={<Policy />} />
          <Route
            path="/faqs"
            element={!token ? <FAQs /> : <Forbidden role={userRole} />}
          />
          <Route path="/about" element={<About />} />
          <Route
            path="/contact"
            element={
              !token || isUser ? <Contact /> : <Forbidden role={userRole} />
            }
          />
          <Route
            path="/unblock-account"
            element={
              !token || isUser ? <Unblocked /> : <Forbidden role={userRole} />
            }
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
      <Outlet />
    </div>
  );
};

export default userLayout;
