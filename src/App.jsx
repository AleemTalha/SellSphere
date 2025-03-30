import React, { Suspense, lazy, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import ContactButton from "./components/ContactButton/ContactButton";

const Login = lazy(() => import("./pages/user/login"));
// const Dashboard = lazy(() => import("./pages/user/dashboard/dashboard"));
import Dashboard from "./pages/user/dashboard/dashboard";
const ErrorPage = lazy(() => import("./pages/error/ErrorPage"));
const PostAd = lazy(() => import("./pages/user/postAd/postAd"));
import Loading from "./components/loading";
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
const Application = lazy(() => import("./pages/user/Block-Application/application"));

function TimeoutFallback() {
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTimeoutReached(true);
    }, 10000);

    return () => clearTimeout(timeout);
  }, []);

  if (timeoutReached) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.5rem",
          color: "red",
        }}
      >
        An error occurred. Please wait while we solve this issue.
      </div>
    );
  }

  return <Loading />;
}

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/unblock-account" element={<Application />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/post-ads" element={<PostAd />} />
          <Route path="/forgot-password" element={<ForgotEmail />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/category/:category/:subcategory?" element={<CategoriesSearching />} />
          <Route path="/item-id/:id/:category/" element={<ItemDetails />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
      <ContactButton />
    </Router>
  );
}

export default App;
