import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, NavLink } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import categoriesData from "../../../data/categories";
import Loading from "../../../components/loading";

const PostAd = () => {
  const [userLogin, setUserLogin] = useState(false);
  const [setted, setSetted] = useState(false);
  const { register, handleSubmit, setValue, watch, reset } = useForm();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const selectedCategory = watch("category");
  const selectedSubCategory = watch("subCategory");
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  useEffect(() => {
    setCategories(categoriesData);
  }, []);

  const showToast = (message, flag) => {
    const options = {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      newestOnTop: true,
    };

    flag ? toast.success(message, options) : toast.error(message, options);
  };

  useEffect(() => {
    const function1 = async () => {
      const API_URI = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URI}/post`, {
        method: "GET",
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        setUserLogin(true);
      } else if (!result.success && !result.loggedIn) {
        navigate("/login");
        setUserLogin(false);
      }
    };
    function1();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find(
        (cat) => cat.category === selectedCategory
      );
      setSubCategories(category ? category.items : []);
    } else {
      setSubCategories([]);
    }
  }, [selectedCategory, categories]);

  useEffect(() => {
    const location = JSON.parse(localStorage.getItem("userLocation"));
    if (location) {
      setUserLocation(location);
    } else {
      showToast("Location not found. Please set your location.", false);
      setShowLocationModal(true);
    }
  }, []);


  useEffect(() => {
    document.title = "SellSphere - Post Your Ad";
  }, []);

  const submitCategoryData = async (data) => {
    try {
      const API_URI = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URI}/post/attributes`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (result.success) {
        showToast(result.message || "Category submitted successfully!", true);
        setSetted(true);
        setIsSubmitted(true);
      } else {
        showToast(result.message || "Category submission failed", false);
        setSetted(false);
      }
    } catch (error) {
      toast.error("Error: " + error.message, { autoClose: 3000 });
    }
  };

  const onSubmit = async (data) => {
    if (!userLocation) {
      showToast("Location data is missing. Cannot submit ad.", false);
      return;
    }

    setIsSubmitting(true);
    try {
      const API_URI = import.meta.env.VITE_API_URL;
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      formData.append("latitude", userLocation.latitude);
      formData.append("longitude", userLocation.longitude);

      const response = await fetch(`${API_URI}/post/ads`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        showToast(result.message || "Ad posted successfully!", true);
        reset();
        navigate("/");
        setImagePreview(null);
      } else {
        showToast(result.message || "Ad posting failed", false);
      }
    } catch (error) {
      toast.error("Error: " + error.message, { autoClose: 3000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setLoading(false);
    };
    reader.readAsDataURL(file);
    setValue("image", e.target.files);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
      {userLogin ? (
        <>
          <nav className="navbar bg-nav px-xl-5 px-lg-4 px-md-3 px-sm-2 px-1 d-flex justify-content-between">
            <NavLink to="/" className="">
              <img src="/images/logo2.png" className="logo-2" />
            </NavLink>
            <button
              onClick={() => {
                if (!isSubmitted) {
                  navigate(-1);
                } else {
                  setIsSubmitted(false);
                  setSetted(false);
                  setValue("category", "");
                  setValue("subCategory", "");
                  setValue("image", "");
                  setImagePreview(null);
                  reset();
                }
              }}
              className="btn btn-outline-light d-flex align-items-center"
            >
              <i className="bi bi-arrow-left me-1"></i> Back
            </button>
          </nav>
          <div className="container mt-4">
            <form
              onSubmit={handleSubmit(
                isSubmitted ? onSubmit : submitCategoryData
              )}
            >
              {!isSubmitted ? (
                <div className="row">
                  <div className="col-md-6">
                    <h4>Select Category</h4>
                    <div className="list-group">
                      {categories.map((category) => (
                        <button
                          key={category.category}
                          type="button"
                          className={`list-group-item list-group-item-action ${
                            selectedCategory === category.category
                              ? "active bg-nav border-0 text-white"
                              : ""
                          }`}
                          onClick={() => {
                            setValue("category", category.category);
                            setValue("subCategory", "");
                          }}
                        >
                          {category.category}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h4>Select Sub-Category</h4>
                    {selectedCategory ? (
                      <div className="list-group">
                        {subCategories.map((subCategory) => (
                          <button
                            key={subCategory}
                            type="button"
                            className={`list-group-item list-group-item-action ${
                              selectedSubCategory === subCategory
                                ? "active bg-nav border-0 text-white"
                                : ""
                            }`}
                            onClick={() => setValue("subCategory", subCategory)}
                          >
                            {subCategory}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted">
                        Please select a category first
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="container p-4 border rounded shadow bg-white">
                  <div className="d-flex align-items-center mb-3">
                    <button
                      className="btn text-dark border border-2 me-2"
                      onClick={() => {
                        setIsSubmitted(false);
                        setSetted(false);
                        setValue("category", "");
                        setValue("subCategory", "");
                        setValue("image", "");
                        setImagePreview(null);
                        reset();
                      }}
                    >
                      ← Back
                    </button>
                    <h2 className="text-center flex-grow-1">Post Your Ad</h2>
                  </div>

                  <div className="mb-3 text-center d-flex justify-content-center">
                    <div
                      className="border rounded d-flex align-items-center justify-content-center position-relative"
                      style={{
                        width: "250px",
                        height: "250px",
                        backgroundColor: "#f8f9fa",
                        overflow: "hidden",
                      }}
                    >
                      {loading ? (
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        ></div>
                      ) : imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-100 h-100"
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <p className="text-muted">
                          No image selected <br /> Please upload a square image
                        </p>
                      )}
                      <input
                        type="file"
                        name="image"
                        className="form-control position-absolute opacity-0 w-100 h-100"
                        style={{ cursor: "pointer" }}
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      placeholder="Enter Ad Title"
                      required
                      {...register("title")}
                    />
                  </div>

                  {selectedCategory === "Cars" && (
                    <>
                      <div className="d-flex gap-3">
                        <div className="mb-3 flex-grow-1">
                          <label className="form-label">Make</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Car Make"
                            {...register("Make")}
                          />
                        </div>
                        <div className="mb-3 flex-grow-1">
                          <label className="form-label">Model</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Car Model"
                            {...register("Model")}
                          />
                        </div>
                      </div>
                      <div className="d-flex gap-3">
                        <div className="mb-3 flex-grow-1">
                          <label className="form-label">Year</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Enter Car Year"
                            {...register("Year")}
                          />
                        </div>
                        <div className="mb-3 flex-grow-1">
                          <label className="form-label">Mileage</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Enter Mileage (KM)"
                            {...register("Mileage")}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {selectedCategory === "House" && (
                    <>
                      <div className="d-flex gap-3">
                        <div className="mb-3 flex-grow-1">
                          <label className="form-label">Area (sq ft)</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Enter Area"
                            {...register("Area")}
                          />
                        </div>
                        <div className="mb-3 flex-grow-1">
                          <label className="form-label">Rooms</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Enter Number of Rooms"
                            {...register("Rooms")}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input
                      type="number"
                      name="price"
                      className="form-control"
                      placeholder="Enter Price"
                      required
                      {...register("price")}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Condition</label>
                    <select
                      name="condition"
                      className="form-control"
                      required
                      {...register("condition")}
                    >
                      <option value="">Select Condition</option>
                      <option value="new">New</option>
                      <option value="used">Used</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      className="form-control"
                      placeholder="Enter Phone Number"
                      required
                      {...register("phoneNumber")}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      className="form-control"
                      placeholder="Write a short description"
                      required
                      {...register("description")}
                      style={{minHeight: "200px"}}
                    ></textarea>
                  </div>

                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      name="showNumber"
                      className="form-check-input"
                      id="showNumber"
                      {...register("showNumber")}
                    />
                    <label className="form-check-label" htmlFor="showNumber">
                      Show Phone Number on Ad
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : (
                      "Post Ad"
                    )}
                  </button>
                </div>
              )}
              {!setted && (
                <div className="text-center mt-4">
                  <button
                    type="submit"
                    className="btn elong transition-all"
                    style={{ border: "2px solid var(--bg-nav)" }}
                    disabled={
                      !selectedCategory || !selectedSubCategory || isSubmitting
                    }
                  >
                    {!submitCategoryData ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : (
                      <>
                        <div>
                          Next <i className="b- bi-arrow-right"></i>
                        </div>
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </>
      ) : (
        <>
          <div
            className="text-center h2 pt-5"
            style={{ color: "var(--bg-nav)" }}
          >
            <Loading />
          </div>
        </>
      )}
      {showLocationModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Location Required</h5>
              </div>
              <div className="modal-body">
                <p>
                  Your location is not set. Please go to the dashboard and set
                  your location to proceed.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => navigate("/dashboard")}
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostAd;
