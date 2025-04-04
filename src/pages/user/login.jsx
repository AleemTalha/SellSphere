import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { set, useForm } from "react-hook-form";
import "./login.css";
import Navbar from "../../components/loginNav/navbar";
import Footer from "../../components/Footer/Footer";
import Loading from "../../components/loading";

const login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLogin, setIsLogin] = useState("login");
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
    const allFilled = !otpValues.includes("");
    setIsOTPComplete(allFilled);
  };
  const combineOTP = () => {
    const otpValues = otpRefs.current.map((input) => input?.value.trim());
    return otpValues.join("");
  };
  const showToast = (message, flag) => {
    if (flag) {
      toast.success(message, {
        position: "top-center",
        autoClose: 5000,
      });
    } else {
      toast.error(message, {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };

  const {
    register,
    handleSubmit,
    setError,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (isLogin === "otp" && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [isLogin, timer]);
  const onSubmit = async (data) => {
    let API_URL = import.meta.env.VITE_API_URL;
    if (isLogin === "login") {
      API_URL = API_URL + "/login";
    } else if (isLogin === "register") {
      API_URL = API_URL + "/register";
    } else if (isLogin === "otp") {
      const otp = combineOTP();
      data.otp = otp;
      API_URL = API_URL + "/register/verify";
    } else if (isLogin === "password") {
      API_URL = API_URL + "/register/credentials";
    }
    if (isLogin === "login" || isLogin === "password") {
      try {
        const response = await fetch("https://api64.ipify.org?format=json");
        const ipData = await response.json();
        data.ipAddress = ipData.ip;
      } catch (error) {
        console.error("Error fetching IP:", error);
      }
    }

    const response = await fetch(`${API_URL}`, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    const cookies = response.headers.get("set-cookie");
    if (cookies) {
      document.cookie = `token=${
        cookies.split("token=")[1].split(";")[0]
      };path=/;secure;SameSite=None`;
    }

    const responseData = await response.json();
    reset();

    if (responseData.success) {
      if (isLogin === "register") {
        setIsLogin("otp");
      } else if (isLogin === "otp") {
        setIsLogin("password");
      } else if (isLogin === "password") {
        setIsLogin("login");
      } else if (isLogin === "login") {
        if (responseData.role === "user") {
          navigate("/");
        } else if (responseData.role === "admin") {
          navigate("/admin/dashboard");
        }
      }
      showToast(responseData.message, true);
    } else {
      showToast(responseData.message, false);
    }
  };

  const resendOTP = async () => {
    setTimer(60);
    setCanResend(false);
    onSubmit("no data");
  };
  const validateDOB = (value) => {
    const year = new Date(value).getFullYear();
    return year >= 1940 && year <= 2020;
  };
  const validatePasswordMatch = (value) => {
    return value === watch("password");
  };
  useEffect(() => {
    document.title = "SellSphere - Login";
  }, []);

  if (loading) return null;

  return (
    <div>
      <ToastContainer />
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <div className="row m-0 login-page border border-2">
          <div className="row p-0 m-0" style={{ minHeight: "730px" }}>
            <div className="col-lg-5 col-md-6 pt-5">
              <div
                className={`form-container ${
                  isLogin === "login"
                    ? "login-form"
                    : isLogin === "register"
                    ? "register-form"
                    : isLogin === "otp"
                    ? "otp-form"
                    : "password-form"
                }`}
              >
                {isLogin === "login" ? (
                  <div className="form-content slide-in">
                    <div className="d-flex justify-content-center align-items-center">
                      <form
                        autoComplete="on"
                        onSubmit={handleSubmit(onSubmit)}
                        className="p-4 border rounded-4 bg-white"
                        style={{
                          maxWidth: "380px",
                          width: "100%",
                          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
                        }}
                      >
                        <nav className="d-flex justify-content-center mb-3">
                          <img
                            src="/images/logo1.png"
                            alt="Logo"
                            style={{ height: "50px" }}
                          />
                        </nav>

                        <h3 className="text-center mb-3 pt-2 fw-bold text-nav">
                          Welcome Back!
                        </h3>

                        <p className="text-center mb-4 text-muted">
                          Please enter your credentials to continue your
                          journey.
                        </p>

                        <div className="mb-3">
                          <label
                            htmlFor="email"
                            className="form-label fw-semibold"
                          >
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            className="form-control rounded-3"
                            id="email"
                            autoComplete="email"
                            required
                            minLength={5}
                            {...register("email")}
                          />
                        </div>

                        <div className="mb-3">
                          <label
                            htmlFor="password"
                            className="form-label fw-semibold"
                          >
                            Password
                          </label>
                          <div className="position-relative">
                            <input
                              {...register("password")}
                              type={passwordVisible ? "text" : "password"}
                              name="password"
                              className="form-control rounded-3"
                              id="password"
                              required
                              minLength={8}
                              autoComplete="current-password"
                            />
                            <button
                              type="button"
                              className="position-absolute top-50 end-0 translate-middle-y bg-nav border-0 text-light rounded-3 p-2"
                              onClick={() =>
                                setPasswordVisible(!passwordVisible)
                              }
                              style={{
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                              }}
                            >
                              <i
                                className={`bi ${
                                  passwordVisible ? "bi-eye-slash" : "bi-eye"
                                } fs-5`}
                              />
                            </button>
                          </div>
                          <small className="form-text text-muted">
                            Your password must be at least 8 characters.
                          </small>
                        </div>

                        <div className="text-end">
                          <button
                            type="button"
                            className="border-0 bg-transparent "
                            onClick={() => navigate("/forgot-password")}
                          >
                            <span className="text-nav cursor-pointer text-decoration-underline">
                              Forgot Password?
                            </span>
                          </button>
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
                              <span> Authenticating...</span>
                            </div>
                          ) : (
                            "Login"
                          )}
                        </button>

                        <div className="mt-4 text-center text-muted">
                          <p>
                            New here?{" "}
                            <span
                              onClick={() => setIsLogin("register")}
                              className="text-nav text-decoration-underline cursor-pointer"
                            >
                              Create an account
                            </span>
                          </p>
                        </div>
                      </form>
                    </div>
                  </div>
                ) : isLogin === "register" ? (
                  <div className="form-content slide-in">
                    <div className="d-flex justify-content-center align-items-center">
                      <form
                        autoComplete="on"
                        onSubmit={handleSubmit(onSubmit)}
                        className="p-4 border rounded"
                        style={{
                          maxWidth: "400px",
                          width: "100%",
                          boxShadow: "5px 5px 30px rgb(142, 142, 142)",
                        }}
                      >
                        <nav>
                          <div className="brand d-flex justify-content-center">
                            <img src="/images/logo1.png" />
                          </div>
                        </nav>
                        <h3 className="text-center mb-3 pt-3">
                          Create Your Account
                        </h3>

                        <p className="text-center mb-3 text-muted">
                          Join us and start your journey with us. It's quick and
                          easy!
                        </p>

                        <div className="row">
                          <div className="col-6 mb-3">
                            <label htmlFor="firstName" className="form-label">
                              First Name
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              className="form-control"
                              id="firstName"
                              required
                              minLength={2}
                              {...register("firstName")}
                            />
                          </div>

                          <div className="col-6 mb-3">
                            <label htmlFor="lastName" className="form-label">
                              Last Name
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              className="form-control"
                              id="lastName"
                              required
                              minLength={2}
                              {...register("lastName")}
                            />
                          </div>
                        </div>

                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">
                            Email address
                          </label>
                          <input
                            type="email"
                            name="email"
                            className="form-control"
                            id="email"
                            autoComplete="email"
                            required
                            minLength={5}
                            {...register("email")}
                          />
                        </div>

                        <div className="mb-3 form-check">
                          <span>Already have an account?&nbsp;</span>
                          <span
                            className="cursor-pointer text-nav"
                            onClick={() => {
                              setIsLogin("login");
                              reset();
                            }}
                          >
                            Login Now
                          </span>
                        </div>

                        <button
                          disabled={isSubmitting}
                          className="btn w-100 border border-2 bg-nav text-light"
                          type="submit"
                        >
                          {isSubmitting ? (
                            <div>
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              <span> Sending verification code</span>
                            </div>
                          ) : (
                            "Register"
                          )}
                        </button>

                        <p className="text-center mt-4 text-muted">
                          By signing up, you agree to our{" "}
                          <NavLink to="/policy" className="text-nav">
                            Terms & Conditions
                          </NavLink>{" "}
                          and{" "}
                          <NavLink to="/policy" className="text-nav">
                            Privacy Policy
                          </NavLink>
                          .
                        </p>
                      </form>
                    </div>
                  </div>
                ) : isLogin === "otp" ? (
                  <div className="form-content slide-in">
                    <button
                      className="btn border-0 "
                      onClick={() => {
                        setIsLogin("register");
                        reset();
                      }}
                    >
                      <i className="bi bi-arrow-left h2"></i>
                    </button>
                    <div className="d-flex justify-content-center align-items-center">
                      <form
                        autoComplete="on"
                        onSubmit={handleSubmit(onSubmit)}
                        className="p-4 border rounded"
                        style={{
                          maxWidth: "400px",
                          width: "100%",
                          boxShadow: "5px 5px 30px rgb(142, 142, 142)",
                        }}
                      >
                        <nav>
                          <div className="brand d-flex justify-content-center">
                            <img src="/images/logo1.png" />
                          </div>
                        </nav>
                        <h3 className="text-center mb-3 pt-3">
                          OTP Verification
                        </h3>

                        <div className="mb-3">
                          <label htmlFor="otp" className="form-label">
                            OTP
                          </label>
                          <div className="d-flex justify-content-between">
                            {Array.from({ length: 6 }).map((_, index) => (
                              <input
                                type="text"
                                name={`otp-${index}`}
                                className="form-control otp-input"
                                id={`otp-${index}`}
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
                            className="border-0"
                            onClick={() => {
                              reset();
                              resendOTP();
                            }}
                            disabled={!canResend}
                          >
                            {canResend ? (
                              <p className="nav-text cursor-pointer text-underline">
                                Resend OTP
                              </p>
                            ) : (
                              <p className="text-btn">
                                Request again in {timer} seconds
                              </p>
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
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              <span> Authenticating code</span>
                            </div>
                          ) : (
                            "Verify OTP"
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
                ) : (
                  <div className="form-content slide-in">
                    <div className="d-flex justify-content-center align-items-center">
                      <form
                        autoComplete="on"
                        onSubmit={handleSubmit(onSubmit)}
                        className="p-4 border rounded shadow-lg"
                        style={{
                          maxWidth: "400px",
                          width: "100%",
                          backgroundColor: "#fff",
                          borderRadius: "8px",
                          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <nav>
                          <div className="brand d-flex justify-content-center mb-4">
                            <img
                              src="/images/logo1.png"
                              alt="Logo"
                              width="120"
                            />
                          </div>
                        </nav>
                        <h3 className="text-center text-dark mb-4">
                          Set Your Secure Password
                        </h3>

                        <div className="mb-3">
                          <label
                            htmlFor="dob"
                            className="form-label text-muted"
                          >
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            name="dob"
                            className="form-control"
                            id="dob"
                            required
                            {...register("dob", { validate: validateDOB })}
                          />
                          {errors.dob && (
                            <span className="text-danger">
                              Date of Birth must be between 1940 and 2020
                            </span>
                          )}
                        </div>

                        <div className="mb-3">
                          <label
                            htmlFor="password"
                            className="form-label text-muted"
                          >
                            Password
                          </label>
                          <div className="input-group">
                            <input
                              type="password"
                              name="password"
                              className="form-control"
                              id="password"
                              required
                              minLength={8}
                              placeholder="Enter a strong password"
                              {...register("password")}
                            />
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => {
                                const passwordField =
                                  document.getElementById("password");
                                const type =
                                  passwordField.type === "password"
                                    ? "text"
                                    : "password";
                                passwordField.type = type;
                              }}
                              style={{ borderRadius: "0 4px 4px 0" }}
                            >
                              <i className="bi bi-eye" aria-hidden="true"></i>
                            </button>
                          </div>
                        </div>

                        <div className="mb-3">
                          <label
                            htmlFor="confirmPassword"
                            className="form-label text-muted"
                          >
                            Confirm Password
                          </label>
                          <div className="input-group">
                            <input
                              type="password"
                              name="confirmPassword"
                              className="form-control"
                              id="confirmPassword"
                              required
                              minLength={8}
                              placeholder="Re-enter your password"
                              {...register("confirmPassword", {
                                validate: validatePasswordMatch,
                              })}
                            />
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => {
                                const confirmPasswordField =
                                  document.getElementById("confirmPassword");
                                const type =
                                  confirmPasswordField.type === "password"
                                    ? "text"
                                    : "password";
                                confirmPasswordField.type = type;
                              }}
                              style={{ borderRadius: "0 4px 4px 0" }}
                            >
                              <i className="bi bi-eye" aria-hidden="true"></i>
                            </button>
                          </div>
                          {errors.confirmPassword && (
                            <span className="text-danger">
                              Passwords do not match
                            </span>
                          )}
                        </div>

                        <div className="text-center mt-4">
                          <button
                            disabled={isSubmitting}
                            className="btn w-100 border border-2 bg-nav text-light"
                            type="submit"
                          >
                            {isSubmitting ? (
                              <div>
                                <span
                                  className="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                <span> Please wait, processing...</span>
                              </div>
                            ) : (
                              "Set Password"
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-7 col-md-6 col-sm-4 login-section m-0 p-0 d-none d-md-block">
              <div
                className="w-100 h-100 d-flex justify-content-center text-center"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.85)",
                  padding: "2rem",
                }}
              >
                <div className="pt-5 mt-5">
                  {isLogin === "login" ? (
                    <div className="text-section">
                      <h1
                        className="display-2 text-nav"
                        style={{ fontWeight: "400" }}
                      >
                        Welcome Back!
                      </h1>
                      <p className="fs-6 text-light mt-2">
                        We missed you! Unlock new possibilities and pick up
                        right where you left off. Don’t have an account yet?
                        Join us today and be part of something amazing!
                      </p>
                      <button
                        className="bg-nav rounded-3 px-4 py-2 login-btns transition-all elong mt-3 fw-semibold fs-6 shadow-sm"
                        onClick={() => setIsLogin("register")}
                      >
                        Register Now
                      </button>
                    </div>
                  ) : isLogin === "register" ? (
                    <div className="text-section">
                      <h1
                        className="display-2 text-nav"
                        style={{ fontWeight: "400" }}
                      >
                        Join the Community!
                      </h1>
                      <p className="fs-6 text-light mt-2">
                        Step into a world of opportunities! Sign up now and
                        experience the best. Already have an account? Log in and
                        keep the journey going!
                      </p>
                      <button
                        className="bg-nav rounded-3 px-4 py-2 login-btns transition-all elong mt-3 fw-semibold fs-6 shadow-sm"
                        onClick={() => setIsLogin("login")}
                      >
                        Log In Now
                      </button>
                    </div>
                  ) : (
                    <div className="text-section">
                      <h1
                        className="display-2 text-nav"
                        style={{ fontWeight: "400" }}
                      >
                        Welcome to SellSphere!
                      </h1>
                      <p className="fs-6 text-light mt-2">
                        Your journey starts here. Follow the steps to complete
                        your registration and open doors to endless
                        opportunities!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isLogin === "login" && (
        <div className="pt-5 mt-5 text-center">
          <p className="text-danger fw-bold">
            If your account is blocked.{" "}
            <NavLink
              to="/unblock-account"
              className="text-primary text-decoration-none"
            >
              Click here to send application unblock your account
            </NavLink>
          </p>
          <div className="mb-4">
            <NavLink
              className="text-decoration-none bg-nav btn"
              to="/unblock-account"
            >
              <span className="text-light fw-bold">Unblock Application</span>
            </NavLink>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default login;
