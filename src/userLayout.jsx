import React, { Suspense, lazy } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Dashboard from "./pages/user/dashboard/dashboard";
import Loading from "./components/loading";
import Forbidden from "./pages/error/Forbidden";

const PostAd = lazy(() => import("./pages/user/postAd/postAd"));
const ForgotEmail = lazy(() => import("./pages/user/forgotPassword/forgot"));
const Policy = lazy(() => import("./pages/user/policy/Policy"));
const Contact = lazy(() => import("./pages/user/contact/Contact"));
const FAQs = lazy(() => import("./pages/user/FAQs/faq"));
const Profile = lazy(() => import("./pages/user/profile/Profile"));
const About = lazy(() => import("./pages/About/About"));
const ItemDetails = lazy(() => import("./pages/user/itemsDetail/ItemDetails"));
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
    console.error("Invalid JWT format");
    return null;
  }
  const base64Url = parts[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const decodedData = JSON.parse(atob(base64));
  return decodedData;
};

const userLayout = () => {
  const token = getCookie("token");
  const decodedToken = token ? decodeJWT(token) : null;
  const userRole = decodedToken?.role;

  const isUser = token && userRole === "user";
  const isAdmin = token && userRole === "admin";

  return (
    <div>
      <Suspense fallback={<Loading />}>
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
                <Profile />
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
          <Route
            path="/policy"
            element={!token ? <Policy /> : <Forbidden role={userRole} />}
          />
          <Route
            path="/faqs"
            element={!token ? <FAQs /> : <Forbidden role={userRole} />}
          />
          <Route
            path="/about"
            element={!token ? <About /> : <Forbidden role={userRole} />}
          />
          <Route
            path="/contact"
            element={!token ? <Contact /> : <Forbidden role={userRole} />}
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
      <Outlet />
    </div>
  );
};

export default userLayout;
