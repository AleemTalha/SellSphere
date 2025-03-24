import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, NavLink } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import categoriesData from "../../../data/categories";

const PostAd = () => {
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

  useEffect(() => {
    setCategories(categoriesData);
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
        toast.success(result.message || "Category submitted successfully!", {
          autoClose: 3000,
        });
        setSetted(true);
        setIsSubmitted(true);
      } else {
        toast.error(result.message || "Category submission failed", {
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("Error: " + error.message, { autoClose: 3000 });
    }
  };

  const onSubmit = async (data) => {
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

      const response = await fetch(`${API_URI}/post/ads`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || "Ad posted successfully!", {
          autoClose: 3000,
        });
        reset();
        navigate("/");
        setImagePreview(null);
      } else {
        toast.error(result.message || "Ad posting failed", { autoClose: 3000 });
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
      <nav className="navbar bg-nav px-xl-5 px-lg-4 px-md-3 px-sm-2 px-1 d-flex justify-content-between">
        <NavLink to="/" className="">
          <img src="/images/logo2.png" className="logo-2" />
        </NavLink>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-outline-light d-flex align-items-center"
        >
          <i className="bi bi-arrow-left me-1"></i> Back
        </button>
      </nav>
      <div className="container mt-4">
        <form
          onSubmit={handleSubmit(isSubmitted ? onSubmit : submitCategoryData)}
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
                  <p className="text-muted">Please select a category first</p>
                )}
              </div>
            </div>
          ) : (
            <div className="container p-4 border rounded shadow bg-white">
              <h2 className="text-center mb-4">Post Your Ad</h2>
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
                    <p className="text-muted">No image selected</p>
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

              {/* Title */}
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

              {/* Description */}
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  placeholder="Write a short description"
                  required
                  {...register("description")}
                ></textarea>
              </div>

              {/* Condition */}
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

              {/* Price */}
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

              {/* Phone Number */}
              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  name="PhoneNumber"
                  className="form-control"
                  placeholder="Enter Phone Number"
                  required
                  {...register("PhoneNumber")}
                />
              </div>

              {/* Show Number Checkbox */}
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

              {/* Submit Button */}
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
                className="btn btn-primary"
                disabled={
                  !selectedCategory || !selectedSubCategory || isSubmitting
                }
              >
                {isSubmitting ? (
                  <span className="spinner-border spinner-border-sm me-2"></span>
                ) : (
                  "Next"
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default PostAd;
