import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import "./login.css";

const login = () => {
  const [isLogin, setIsLogin] = useState("login");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

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
    console.log(API_URL);
    if (isLogin === "login") {
      API_URL = API_URL + "/login";
    } else if (isLogin === "register") {
      API_URL = API_URL + "/register";
    } else if (isLogin === "otp") {
      API_URL = API_URL + "/register/verify";
    } else if (isLogin === "password") {
      API_URL = API_URL + "/register/credentials";
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
    const responseData = await response.json();
    showToast(responseData.message, responseData.success);
    reset();
    if (responseData.success) {
      if (isLogin === "register") {
        setIsLogin("otp");
      } else if (isLogin === "otp") {
        setIsLogin("password");
      } else if (isLogin === "password") {
        setIsLogin("login");
      } else if (isLogin === "login") {
        window.location.href = "/";
      }
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

  return (
    <div>
      {/* <Helmet>
      <title>SellSphere - Login</title>
      </Helmet> */}
      <ToastContainer />
      <div className="row m-0 login-page">
        <div className="row p-0 m-0" style={{ minHeight: "100vh" }}>
          <div className="col-lg-5 pt-5">
            <div className="text-nav display-4 text-center great mt-lg-5 mt-md-4 mt-3 mb-3">
              SellSphere
            </div>
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
                      <h3 className="text-center mb-3 pt-3">Login</h3>

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

                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                          Password
                        </label>
                        <input
                          {...register("password")}
                          type="password"
                          name="password"
                          className="form-control"
                          id="password"
                          required
                          minLength={8}
                          autoComplete="current-password"
                        />
                      </div>
                      <div className="text-nav cursor-pointer text-end px-3 text-decoration-underline mb-3">
                        Forgot Password
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
                            <span> Please Wait</span>
                          </div>
                        ) : (
                          "Login"
                        )}
                      </button>
                      <div className="mt-3 form-check">
                        <span>Don't have an account?&nbsp;</span>
                        <span
                          className="cursor-pointer text-nav"
                          onClick={() => {
                            setIsLogin("register");
                            reset();
                          }}
                        >
                          {" "}
                          <span className="text-decoration-underline">
                            Register Now
                          </span>
                        </span>
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
                      <h3 className="text-center mb-3 pt-3">Register</h3>

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
                            <span> Please Wait</span>
                          </div>
                        ) : (
                          "Register"
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              ) : isLogin === "otp" ? (
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
                        OTP Verification
                      </h3>

                      <div className="mb-3">
                        <label htmlFor="otp" className="form-label">
                          OTP
                        </label>
                        <input
                          type="text"
                          name="otp"
                          className="form-control"
                          id="otp"
                          required
                          minLength={6}
                          maxLength={6}
                          {...register("otp")}
                        />
                      </div>
                      <div className="text-center mt-3">
                        <button
                          className="border-0"
                          onClick={() => {
                            setIsLogin("register");
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
                            <span> Please Wait</span>
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
                      <h3 className="text-center mb-3 pt-3">Set Password</h3>

                      <div className="mb-3">
                        <label htmlFor="dob" className="form-label">
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
                        <label htmlFor="password" className="form-label">
                          Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          className="form-control"
                          id="password"
                          required
                          minLength={8}
                          {...register("password")}
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          className="form-control"
                          id="confirmPassword"
                          required
                          minLength={8}
                          {...register("confirmPassword", {
                            validate: validatePasswordMatch,
                          })}
                        />
                        {errors.confirmPassword && (
                          <span className="text-danger">
                            Passwords do not match
                          </span>
                        )}
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
                            <span> Please Wait</span>
                          </div>
                        ) : (
                          "Set Password"
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-7 login-section m-0 p-0 d-none d-lg-block">
            <div className="w-100 h-100"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default login;
