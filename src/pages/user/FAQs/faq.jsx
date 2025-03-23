import React from "react";
import { NavLink } from "react-router-dom";
const FAQ = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-nav sticky-top px-xl-5 px-lg-4 px-md-3 px-sm-2 px-1 py-1 py-lg-2">
        <div className="container-fluid">
          <NavLink className="" to="/">
            <img src="/images/logo2.png" className="logo-2" alt="" />
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse text-center" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink
                  className=" text-decoration-none text-light nav-link mx-2 rounded-2 elong transition-all"
                  to="/"
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className=" text-decoration-none text-light nav-link mx-2 rounded-2 elong transition-all"
                  to="/contact"
                >
                  Contact Us
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container my-5">
        <h1 className="text-center mb-4 fw-bold">Frequently Asked Questions</h1>

        <div className="accordion" id="faqsAccordion">
          {/* How to Get Object from Customer/Seller */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq1"
              >
                How to Get an Object from a Customer or Seller?
              </button>
            </h2>
            <div
              id="faq1"
              className="accordion-collapse collapse show"
              data-bs-parent="#faqsAccordion"
            >
              <div className="accordion-body">
                To get an object from a seller or customer, follow these steps:
                <ol>
                  <li>
                    Contact the seller/customer through the provided chat
                    system.
                  </li>
                  <li>Negotiate the terms and confirm the exchange.</li>
                  <li>Arrange a meeting place and time for the exchange.</li>
                  <li>Inspect the item and complete the exchange.</li>
                </ol>
              </div>
            </div>
          </div>

          {/* How to Unblock Account */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq2"
              >
                How to Unblock My Account?
              </button>
            </h2>
            <div
              id="faq2"
              className="accordion-collapse collapse"
              data-bs-parent="#faqsAccordion"
            >
              <div className="accordion-body">
                If your account has been blocked, you need to submit an
                application for review:
                <ol>
                  <li>
                    Go to the <strong>Contact Us</strong> page.
                  </li>
                  <li>
                    Fill out the <strong>Unblock Account Request</strong> form.
                  </li>
                  <li>
                    Provide necessary details and attach identity verification
                    (if required).
                  </li>
                  <li>
                    Wait for the response from our support team (takes 24-48
                    hours).
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* How to Register */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq3"
              >
                How to Register on SellSphere?
              </button>
            </h2>
            <div
              id="faq3"
              className="accordion-collapse collapse"
              data-bs-parent="#faqsAccordion"
            >
              <div className="accordion-body">
                Registering on SellSphere is easy:
                <ul>
                  <li>
                    Click on the <strong>Sign Up</strong> button on the
                    homepage.
                  </li>
                  <li>Fill in your details (Name, Email, Password, etc.).</li>
                  <li>Verify your email through the confirmation link.</li>
                  <li>Login and start exploring products.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How to Login */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq4"
              >
                How to Login?
              </button>
            </h2>
            <div
              id="faq4"
              className="accordion-collapse collapse"
              data-bs-parent="#faqsAccordion"
            >
              <div className="accordion-body">
                To login:
                <ul>
                  <li>
                    Go to the <strong>Login Page</strong>.
                  </li>
                  <li>Enter your registered email and password.</li>
                  <li>
                    Click <strong>Login</strong> to access your account.
                  </li>
                  <li>
                    If you forgot your password, use the{" "}
                    <strong>Forgot Password</strong> option.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* How to Update Password */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq5"
              >
                How to Update My Password?
              </button>
            </h2>
            <div
              id="faq5"
              className="accordion-collapse collapse"
              data-bs-parent="#faqsAccordion"
            >
              <div className="accordion-body">
                Updating your password is simple:
                <ul>
                  <li>
                    Go to <strong>Account Settings</strong>.
                  </li>
                  <li>
                    Select <strong>Change Password</strong>.
                  </li>
                  <li>Enter your current password and new password.</li>
                  <li>
                    Click <strong>Update</strong> and confirm the change.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Login Issues */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq6"
              >
                I Can't Login, What Should I Do?
              </button>
            </h2>
            <div
              id="faq6"
              className="accordion-collapse collapse"
              data-bs-parent="#faqsAccordion"
            >
              <div className="accordion-body">
                If you're facing login issues:
                <ul>
                  <li>Check if your email and password are correct.</li>
                  <li>Ensure that your internet connection is stable.</li>
                  <li>Try resetting your password.</li>
                  <li>Contact support if the issue persists.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* User Reporting */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq7"
              >
                How to Report a User?
              </button>
            </h2>
            <div
              id="faq7"
              className="accordion-collapse collapse"
              data-bs-parent="#faqsAccordion"
            >
              <div className="accordion-body">
                If you encounter an abusive user:
                <ul>
                  <li>Go to the user’s profile.</li>
                  <li>
                    Click <strong>Report</strong> and select a reason.
                  </li>
                  <li>Provide additional details if necessary.</li>
                  <li>Our team will review the report and take action.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Worse Experiences */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq8"
              >
                What to Do If I Had a Bad Experience?
              </button>
            </h2>
            <div
              id="faq8"
              className="accordion-collapse collapse"
              data-bs-parent="#faqsAccordion"
            >
              <div className="accordion-body">
                If you had a bad experience:
                <ul>
                  <li>Leave a review for the user or product.</li>
                  <li>Contact our support team for dispute resolution.</li>
                  <li>If necessary, request a refund (if applicable).</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How to Post an Ad */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq9"
              >
                How to Post an Ad?
              </button>
            </h2>
            <div
              id="faq9"
              className="accordion-collapse collapse"
              data-bs-parent="#faqsAccordion"
            >
              <div className="accordion-body">
                To post an ad on SellSphere:
                <ul>
                  <li>Login to your account.</li>
                  <li>
                    Click on the <strong>Post Ad</strong> button.
                  </li>
                  <li>Fill in the details of the item you want to sell.</li>
                  <li>Upload clear images of the item.</li>
                  <li>Set a price and submit the ad for review.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How to Edit or Delete an Ad */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq10"
              >
                How to Edit or Delete an Ad?
              </button>
            </h2>
            <div
              id="faq10"
              className="accordion-collapse collapse"
              data-bs-parent="#faqsAccordion"
            >
              <div className="accordion-body">
                To edit or delete an ad:
                <ul>
                  <li>
                    Go to your <strong>My Ads</strong> section.
                  </li>
                  <li>Select the ad you want to edit or delete.</li>
                  <li>
                    Click on the <strong>Edit</strong> or{" "}
                    <strong>Delete</strong> button.
                  </li>
                  <li>Make the necessary changes or confirm the deletion.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How to Contact a Seller */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq11"
              >
                How to Contact a Seller?
              </button>
            </h2>
            <div
              id="faq11"
              className="accordion-collapse collapse"
              data-bs-parent="#faqsAccordion"
            >
              <div className="accordion-body">
                To contact a seller:
                <ul>
                  <li>Go to the ad of the item you are interested in.</li>
                  <li>
                    Click on the <strong>Contact Seller</strong> button.
                  </li>
                  <li>Send a message to the seller through the chat system.</li>
                  <li>
                    Wait for the seller to respond and negotiate the terms.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* How to Leave a Review */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq12"
              >
                How to Leave a Review?
              </button>
            </h2>
            <div
              id="faq12"
              className="accordion-collapse collapse"
              data-bs-parent="#faqsAccordion"
            >
              <div className="accordion-body">
                To leave a review:
                <ul>
                  <li>Go to the profile of the user you want to review.</li>
                  <li>
                    Click on the <strong>Leave a Review</strong> button.
                  </li>
                  <li>Rate the user and write your review.</li>
                  <li>Submit the review for others to see.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
