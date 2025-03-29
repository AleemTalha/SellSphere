import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/loginNav/navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Forgot = () => {

  useEffect(() => {
    document.title = "SellSphere - Forgot Password";
  }, []);
  const [form, setForm] = useState("email");
  const navigate = useNavigate();
  const [isOTPComplete, setIsOTPComplete] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const otpRefs = useRef(new Array(6).fill(null));

  const handleOTPInput = (e, index) => {
    if (e.target.value.length === 1 && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  

  const handleOTPKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const validateOtpComplete = () => {
    const otpValues = otpRefs.current.map((input) => input?.value.trim());
    setIsOTPComplete(!otpValues.includes(""));
  };

  const combineOTP = () => {
    return otpRefs.current.map((input) => input?.value.trim()).join("");
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

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
    let API_URL = `${import.meta.env.VITE_API_URL}`;
    if (form === "email") {
      API_URL += "/forgot/password";
    } else if (form === "otp") {
      API_URL += "/forgot/password/verify";
      data.otp = combineOTP();
      if (!isOTPComplete) {
        showToast("Please enter a valid OTP", false);
        return;
      }
    } else if (form === "password") {
      API_URL += "/forgot/password/reset/entry";
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.success) {
      if (form === "email") {
        showToast("Email sent successfully", true);
        setForm("otp");
      } else if (form === "otp") {
        showToast("OTP verified successfully", true);
        setForm("password");
      } else if (form === "password") {
        showToast("Password reset successfully", true);
        navigate("/login");
      }
    } else {
      showToast(
        result.message || "An error occurred, please try again later.",
        false
      );
    }
  };

  const validatePasswordMatch = (value) => {
    return value === watch("password");
  };

  return (
    <>
      <ToastContainer />
      <Navbar />
      <div className="row m-0 login-page">
        <div className="row p-0 m-0" style={{ minHeight: "520px" }}>
          <div
            className="col-lg-7 col-md-6 col-sm-4 login-section m-0 p-0 d-none d-md-block"
            style={{
              backgroundImage: "url('/images/loginForm.webp')",
              backgroundSize: "cover",
            }}
          >
            <div
              className="w-100 h-100 d-flex justify-content-center text-center"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.85)",
                padding: "2rem",
              }}
            >
              <div className="pt-5 mt-5">
                {form === "email" ? (
                  <div className="text-section">
                    <h1
                      className="display-2 text-nav"
                      style={{ fontWeight: "400" }}
                    >
                      Forgot Password?
                    </h1>
                    <p className="fs-6 text-light mt-2">
                      Enter your email to reset your password.
                    </p>
                  </div>
                ) : form === "otp" ? (
                  <div className="text-section">
                    <h1
                      className="display-2 text-nav"
                      style={{ fontWeight: "400" }}
                    >
                      Email Sent!
                    </h1>
                    <p className="fs-6 text-light mt-2">
                      Please check your email for instructions to reset your
                      password.
                    </p>
                  </div>
                ) : (
                  <div className="text-section">
                    <h1
                      className="display-2 text-nav"
                      style={{ fontWeight: "400" }}
                    >
                      Reset Password
                    </h1>
                    <p className="fs-6 text-light mt-2">
                      Enter your new password to reset it.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-5 col-md-6 pt-2">
            <div className="d-flex justify-content-center align-items-center min-vh-100">
              {form === "email" ? (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="p-4 border rounded-4 bg-white position-relative"
                  style={{
                    maxWidth: "380px",
                    width: "100%",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <button
                    type="button"
                    className="position-absolute top-0 start-0 mt-3 ms-3 border-0 bg-transparent text-nav"
                    onClick={() => window.history.back()}
                    style={{ fontSize: "1.5rem" }}
                  >
                    <i className="bi bi-arrow-left"></i>
                  </button>
                  <nav className="d-flex justify-content-center mb-3">
                    <img
                      src="/images/logo1.png"
                      alt="Logo"
                      style={{ height: "50px" }}
                    />
                  </nav>
                  <h3 className="text-center mb-3 pt-2 fw-bold text-nav">
                    Forgot Password?
                  </h3>
                  <p className="text-center mb-4 text-muted">
                    Enter your email to reset your password.
                  </p>

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
                      minLength={5}
                      {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">
                        {errors.email.message}
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
                        <span> Sending...</span>
                      </div>
                    ) : (
                      "Send Reset OTP"
                    )}
                  </button>
                </form>
              ) : form === "otp" ? (<form
                autoComplete="on"
                onSubmit={handleSubmit(onSubmit)}
                className="p-4 border rounded position-relative"
                style={{
                  maxWidth: "400px",
                  width: "100%",
                  boxShadow: "5px 5px 30px rgb(142, 142, 142)",
                }}
              >
                <button
                  type="button"
                  className="position-absolute top-0 start-0 mt-3 ms-3 border-0 bg-transparent text-nav"
                  onClick={() => setForm("email")}
                  style={{ fontSize: "1.5rem" }}
                >
                  <i className="bi bi-arrow-left"></i>
                </button>
                <nav>
                  <div className="brand d-flex justify-content-center">
                    <img src="/images/logo1.png" alt="Logo" style={{ aspectRatio: "1/1", width: "100px" }} />
                  </div>
                </nav>
                <h3 className="text-center mb-3 pt-3">OTP Verification</h3>
              
                <div className="mb-3">
                  <label htmlFor="otp" className="form-label">OTP</label>
                  <div className="d-flex justify-content-between">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <input
                        key={index}
                        type="text"
                        className="form-control otp-input"
                        maxLength={1}
                        required
                        ref={(el) => (otpRefs.current[index] = el)}
                        onKeyUp={(e) => handleOTPInput(e, index)}
                        onKeyDown={(e) => handleOTPKeyDown(e, index)}
                        onBlur={validateOtpComplete}
                      />
                    ))}
                  </div>
                </div>
              
                <div className="text-center mt-3">
                  <button
                    type="button"
                    className="btn btn-link text-decoration-none text-dark"
                    onClick={() => {
                      reset();
                      setTimer(60);
                      setCanResend(false);
                    }}
                    disabled={!canResend}
                  >
                    {canResend ? (
                      <span className="nav-text cursor-pointer text-underline">Resend OTP</span>
                    ) : (
                      <p className="text-btn">Request again in {timer} seconds</p>
                    )}
                  </button>
                </div>
              
                <button
                  disabled={isSubmitting || !isOTPComplete}
                  className="btn w-100 border border-2 bg-nav text-light"
                  type="submit"
                >
                  {isSubmitting ? (
                    <div>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span> Authenticating code</span>
                    </div>
                  ) : (
                    "Verify OTP"
                  )}
                </button>
              </form>
              ) : form === "password" ? (<form
                onSubmit={handleSubmit(onSubmit)}
                className="p-4 border rounded-4 bg-white position-relative"
                style={{
                  maxWidth: "380px",
                  width: "100%",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
                }}
              >
                <button
                  type="button"
                  className="position-absolute top-0 start-0 mt-3 ms-3 border-0 bg-transparent text-nav"
                  onClick={() => setForm("email")}
                  style={{ fontSize: "1.5rem" }}
                >
                  <i className="bi bi-arrow-left"></i>
                </button>
                <nav className="d-flex justify-content-center mb-3">
                  <img src="/images/logo1.png" alt="Logo" style={{ height: "50px" }} />
                </nav>
                <h3 className="text-center mb-3 pt-2 fw-bold text-nav">Reset Password</h3>
                <p className="text-center mb-4 text-muted">Enter your new password to reset it.</p>
              
                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-semibold">New Password</label>
                  <div className="input-group">
                    <input
                      type="password"
                      name="password"
                      className={`form-control rounded-3 ${errors.password ? "is-invalid" : ""}`}
                      id="password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      {...register("password", { required: "Password is required" })}
                    />
                    <span
                      className="input-group-text bg-nav text-light rounded-end-3"
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        let input = e.currentTarget.previousElementSibling;
                        input.type = input.type === "password" ? "text" : "password";
                        e.currentTarget.innerHTML = `<i class="bi ${input.type === "password" ? "bi-eye" : "bi-eye-slash"}"></i>`;
                      }}
                    >
                      <i className="bi bi-eye"></i>
                    </span>
                  </div>
                  {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                </div>
              
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label fw-semibold">Confirm Password</label>
                  <div className="input-group">
                    <input
                      type="password"
                      name="confirmPassword"
                      className={`form-control rounded-3 ${errors.confirmPassword ? "is-invalid" : ""}`}
                      id="confirmPassword"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      {...register("confirmPassword", {
                        required: "Confirm Password is required",
                        validate: validatePasswordMatch,
                      })}
                    />
                    <span
                      className="input-group-text bg-nav text-light rounded-end-3"
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        let input = e.currentTarget.previousElementSibling;
                        input.type = input.type === "password" ? "text" : "password";
                        e.currentTarget.innerHTML = `<i class="bi ${input.type === "password" ? "bi-eye" : "bi-eye-slash"}"></i>`;
                      }}
                    >
                      <i className="bi bi-eye"></i>
                    </span>
                  </div>
                  {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
                </div>
              
                <button
                  disabled={isSubmitting}
                  className="btn w-100 bg-nav text-light rounded-3 mt-3 fw-semibold"
                  type="submit"
                >
                  {isSubmitting ? (
                    <div>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span> Resetting...</span>
                    </div>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
              ) : (
                <div className="text-center">
                  <h3 className="text-danger">Error</h3>
                  <p>Invalid form type</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Forgot;
