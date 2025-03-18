import React from "react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import "./login.css";

const login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const showToast = (message, flag) => {
    if (flag) {
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    let API_URL = import.meta.env.VITE_API_URL;
    if (isLogin) {
      API_URL = API_URL + "/login";
    } else {
      API_URL = API_URL + "/register";
    }
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    showToast(responseData.message, responseData.success);
    reset();
    if (!isLogin) {
      setIsLogin(true);
    }
    if (response.status == 500) {
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="row m-0 login-page">
        <div className="row p-0 m-0" style={{ minHeight: "100vh" }}>
          <div className="col-lg-5 pt-5">
            <div className="text-nav display-4 text-center great mt-lg-5 mt-md-4 mt-3 mb-3">
              SellSphere
            </div>
            <div
              className={`form-container ${
                isLogin ? "login-form" : "register-form"
              }`}
            >
              {isLogin ? (
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
                      <div className="mb-3 form-check">
                        <span>Dont have an account?&nbsp;</span>
                        <span
                          className="cursor-pointer text-nav"
                          onClick={() => setIsLogin(false)}
                        >
                          {" "}
                          Register Now
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
                          "Login"
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
                          <img src="/public/images/top logo.png" />
                        </div>
                      </nav>
                      <h3 className="text-center mb-3 pt-3">Register</h3>

                      <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          id="name"
                          required
                          minLength={5}
                          {...register("name")}
                        />
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
                          onClick={() => setIsLogin(true)}
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
