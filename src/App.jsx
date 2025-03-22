import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import ContactButton from "./components/ContactButton/ContactButton";

const Login = lazy(() => import("./pages/user/login"));
const Dashboard = lazy(() => import("./pages/user/dashboard/dashboard"));
const ErrorPage = lazy(() => import("./pages/error/ErrorPage"));
import Loading from "./components/loading";
const ForgotEmail = lazy(() => import("./pages/user/forgotPassword/forgot"));
const Policy = lazy(() => import("./pages/user/policy/Policy"));
const Contact = lazy(() => import("./pages/user/contact/Contact"));
const FAQs = lazy(() => import("./pages/user/FAQs/faq"));
const Profile = lazy(() => import("./pages/user/profile/Profile"));

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/forgot-password" element={<ForgotEmail />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="*" element={<ErrorPage />} />{" "}
        </Routes>
      </Suspense>
      <ContactButton />
    </Router>
  );
}

export default App;
