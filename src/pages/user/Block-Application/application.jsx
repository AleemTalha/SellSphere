import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink } from "react-router-dom";
import "./application.css";

const application = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    document.title = "Account Block Application";
  }, []);

  const showToastMessage = (success, message) => {
    if (success) {
      toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      const API_URI = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URI}/application`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      showToastMessage(result.success, result.message);
      reset();
    } catch {
      showToastMessage(
        false,
        "An error occurred while submitting the application."
      );
      reset();
    }
  };

  return (
    <>
      <ToastContainer />
      <nav className="navbar fixed-top bg-nav d-flex justify-content-between navbar-expand-lg sticky-top px-xl-5 px-lg-4 px-md-3 px-sm-2 px-1 py-1 py-lg-2">
        <NavLink to="/" className="">
          <img src="/images/logo2.png" alt="logo" className="logo-2" />
        </NavLink>
        <div className="nav-links d-flex gap-4">
          <NavLink
            to="/"
            className="btn elong transition-all nav-link text-light text-decoration-none"
          >
            Home
          </NavLink>
          <NavLink
            to="/faqs"
            className="btn elong transition-all nav-link text-light text-decoration-none"
          >
            FAQs
          </NavLink>
        </div>
      </nav>
      <div className="application-container">
        <div className="application-content">
          <div className="application-form-section">
            <h1 className="text-center">Account Block Application</h1>
            <p className="text-center">
              If your account has been blocked, please fill out the form below
              to submit an application for review. Our team will assess your
              request and respond promptly.
            </p>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="application-form"
            >
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label fw-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    className={`form-control rounded-3 ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    id="email"
                    autoComplete="email"
                    required
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">
                      {errors.email.message}
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  <label htmlFor="fullName" className="form-label fw-semibold">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    className={`form-control rounded-3 ${
                      errors.fullName ? "is-invalid" : ""
                    }`}
                    id="fullName"
                    required
                    {...register("fullName", {
                      required: "Full Name is required",
                    })}
                  />
                  {errors.fullName && (
                    <div className="invalid-feedback">
                      {errors.fullName.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label fw-semibold">
                  Description
                </label>
                <textarea
                  name="description"
                  className={`form-control rounded-3 ${
                    errors.description ? "is-invalid" : ""
                  }`}
                  id="description"
                  rows="7"
                  required
                  {...register("description", {
                    required: "Description is required",
                  })}
                ></textarea>
                {errors.description && (
                  <div className="invalid-feedback">
                    {errors.description.message}
                  </div>
                )}
              </div>

              <button
                disabled={isSubmitting}
                className="btn w-100 bg-nav text-light rounded-3 mt-3 fw-semibold"
                type="submit"
              >
                {isSubmitting ? (
                  <div>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span> Submitting...</span>
                  </div>
                ) : (
                  "Submit Application"
                )}
              </button>
            </form>
          </div>
          <h2>Why Was My Account Blocked?</h2>
          <p>
            Accounts may be blocked for various reasons, including but not
            limited to:
          </p>
          <ul>
            <li>Violation of community guidelines or terms of service.</li>
            <li>Engaging in spam or fraudulent activities.</li>
            <li>Sharing explicit, vulgar, or inappropriate content.</li>
            <li>
              Repeated reports from other users about inappropriate behavior.
            </li>
          </ul>
          <h2>Steps to Resolve Account Blocking</h2>
          <p>
            If you believe your account was blocked in error, follow these
            steps:
          </p>
          <ul>
            <li>Fill out the application form above with accurate details.</li>
            <li>
              Provide a clear explanation of the situation in the description
              field.
            </li>
            <li>Wait for our team to review your application and respond.</li>
          </ul>
          <h2>Preventing Future Account Blocks</h2>
          <p>To avoid account blocks in the future, ensure that you:</p>
          <ul>
            <li>Follow all community guidelines and terms of service.</li>
            <li>
              Respect other users and avoid engaging in harmful activities.
            </li>
            <li>
              Report any suspicious or inappropriate behavior to our support
              team.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default application;
