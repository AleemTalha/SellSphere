import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink } from "react-router-dom";
import "./contact.css";

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  useEffect(() => {
    document.title = "SellSphere - Customer Support";
  }, []);

  const showToast = (message, flag) => {
    if (flag) {
      toast.success(message, {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.error(message, {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      const API_URI = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URI}/simple/application`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        showToast(result.message, true);
        reset();
      } else {
        showToast(result.message, false);
      }
    } catch (error) {
      showToast("An error occurred. Please try again.", false);
    }
  };

  return (
    <>
      <ToastContainer />
      <nav className="navbar d-flex justify-content-between navbar-expand-lg navbar-dark bg-nav sticky-top px-xl-5 px-lg-4 px-md-3 px-sm-2 px-1 py-1 py-lg-2">
        <NavLink to="/" className="brand">
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
      <div className="contact-container">
        <div className="contact-content">
          <div className="contact-form-section">
            <h1 className="text-center">Submit Application</h1>
            <p className="text-center">
              If you have any questions, concerns, or issues, please feel free
              to reach out to us. We are here to help you!
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
              <div className="mb-3">
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
                  <div className="invalid-feedback">{errors.email.message}</div>
                )}
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
                  rows="5"
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
          <h2>How to Unblock Your Account</h2>
          <p>
            If your account has been blocked by the admin for any reason, you
            can follow the steps below to unblock your account:
          </p>
          <ul>
            <li>Contact our support team using the form above.</li>
            <li>Provide your account details and the reason for unblocking.</li>
            <li>
              Our support team will review your request and get back to you.
            </li>
          </ul>
          <NavLink
            to="/unblock-account"
            className="text-nav text-decoration-underline"
          >
            How to unblock the account
          </NavLink>
          <h2>Common Problems and Solutions</h2>
          <h3>1. Payment Issues</h3>
          <p>
            If you are facing issues with payments, such as failed transactions
            or incorrect charges, please follow these steps:
          </p>
          <ul>
            <li>
              Ensure that your payment method is valid and has sufficient funds.
            </li>
            <li>
              Check if your bank or payment provider is experiencing any issues.
            </li>
            <li>
              Contact our support team with the transaction details for further
              assistance.
            </li>
          </ul>
          <h3>2. Order Not Received</h3>
          <p>
            If you have not received your order within the estimated delivery
            time, please follow these steps:
          </p>
          <ul>
            <li>
              Check the order status and tracking information provided in your
              account.
            </li>
            <li>Contact the seller to inquire about the order status.</li>
            <li>
              If the issue persists, contact our support team with your order
              details.
            </li>
          </ul>
          <h3>3. Product Quality Issues</h3>
          <p>
            If you received a product that is damaged, defective, or not as
            described, please follow these steps:
          </p>
          <ul>
            <li>Take clear photos of the product and the issue.</li>
            <li>
              Contact the seller to report the issue and request a resolution.
            </li>
            <li>
              If the seller does not resolve the issue, contact our support team
              with the details and photos.
            </li>
          </ul>
          <h3>4. Account Access Issues</h3>
          <p>
            If you are having trouble accessing your account, such as forgotten
            passwords or account lockouts, please follow these steps:
          </p>
          <ul>
            <li>Use the "Forgot Password" feature to reset your password.</li>
            <li>
              Ensure that you are using the correct email address and password.
            </li>
            <li>
              If you are still unable to access your account, contact our
              support team for assistance.
            </li>
          </ul>
          <h3>5. Seller Issues</h3>
          <p>
            If you are experiencing issues with a seller, such as unresponsive
            communication or disputes, please follow these steps:
          </p>
          <ul>
            <li>
              Attempt to resolve the issue directly with the seller through our
              messaging system.
            </li>
            <li>
              If the issue remains unresolved, contact our support team with the
              details of the dispute.
            </li>
          </ul>
          <h3>6. Technical Issues</h3>
          <p>
            If you encounter technical issues on our website or app, such as
            errors or glitches, please follow these steps:
          </p>
          <ul>
            <li>
              Clear your browser cache and cookies, or try using a different
              browser.
            </li>
            <li>Ensure that your internet connection is stable.</li>
            <li>
              Contact our support team with a detailed description of the issue
              and any error messages.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Contact;
