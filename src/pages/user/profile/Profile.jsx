import React, { useState, useEffect, lazy, Suspense } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./profile.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUpload, FaCamera } from "react-icons/fa";
import Loading from "../../../components/loading";
import { s } from "framer-motion/client";

const CardContainer = lazy(() =>
  import("../../../components/cardContainer/cardContainer")
);

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imgUrl, setImgUrl] = useState(null);
  const [isUser, setIsUser] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const showToastMessage = (success, message) => {
    if (success) {
      toast.success(message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        newestOnTop: true,
      });
    } else {
      toast.error(message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        newestOnTop: true,
      });
    }
  };
  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/profile/profile-id/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const result = await response.json();
      if(result.success == false && result.loggedIn == false)
      {
        showToastMessage(false, result.message || "Please Login first");
        return navigate("/login");
      }
      if (response.ok) {
        setUser(result.user);
        setImgUrl(result.user.profileImage?.url || "/images/default.png");
        setLoading(false);
      } else {
        showToastMessage(
          false,
          result.message || "Failed to fetch user data"
        );
        setLoading(false);
      }
    } catch (error) {
      toast.error("Failed to fetch user data: " + error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const handleImageLoad = () => {
    setImageLoading(false);
    document.body.style.pointerEvents = "auto";
  };

  const handleImageClick = () => {
    setShowUploadForm(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    } else {
      showToastMessage(false, "Please select a valid image file");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    } else {
      showToastMessage(false, "Please select a valid image file");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    setUploading(true);
    document.body.style.pointerEvents = "none";

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/update/profile/image`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);
      const result = await response.json();
      if (response.ok) {
        showToastMessage(true, "Image uploaded successfully");
        setImgUrl(result.profileImage);
        setImageLoading(true);
        setShowUploadForm(false);
        navigate("/");
      } else {
        toast.error(result.message || "Failed to upload image");
      }
    } catch (error) {
      if (error.name === "AbortError") {
        showToastMessage(false, "Request timed out. Please try again.");
      } else {
        showToastMessage(false, "Failed to upload image: " + error.message);
      }
    } finally {
      setUploading(false);
      document.body.style.pointerEvents = "auto";
    }
  };

  return (
    <>
      <ToastContainer />
      {
        !isUser ? (
          <div className="profile-nav">
            
          </div>
        ) :
        (
          <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-nav sticky-top px-xl-5 px-lg-4 px-md-3 px-sm-2 px-1 py-1 py-lg-2">
        <NavLink to="/" className="brand">
          <img src="/images/logo2.png" alt="logo" className="logo-2" />
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
        <div className="collapse navbar-collapse text-center " id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink to="/" className="nav-link bg-nav text-light me-2 text-decoration-none">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/edit-profile"
                className="nav-link bg-nav text-light text-decoration-none"
              >
                Edit Profile
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      <div className="profile-container d-flex justify-content-center align-items-center">
        <div className="profile-content w-100">
          <div className="row align-items-center">
            <div className="col-md-4 text-center">
              <div className="profile-image-container">
                {imageLoading ? (
                  <div className="skeleton skeleton-image"></div>
                ) : (
                  <img
                    src={imgUrl}
                    alt="Profile"
                    className="profile-image fade-in"
                    onLoad={handleImageLoad}
                    onClick={handleImageClick}
                  />
                )}
                <div
                  style={{
                    backgroundColor: "#3f7d58cc",
                  }}
                  className="upload-icon-overlay text-light w-100 h-100 rounded-circle d-flex justify-content-center align-items-center"
                >
                  <FaCamera onClick={handleImageClick} className="fs-3" />
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="profile-info">
                <h1 className="profile-name">
                  {loading ? (
                    <div className="skeleton skeleton-text"></div>
                  ) : (
                    <span className="fade-in">
                      {user?.fullname || "Unknown User"}
                    </span>
                  )}
                </h1>
                <div className="profile-details">
                  {loading ? (
                    <>
                      <div className="profile-field">
                        <div className="skeleton skeleton-full"></div>
                      </div>
                      <div className="profile-field">
                        <div className="skeleton skeleton-full"></div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="profile-field">
                        <label className="profile-label">Email:</label>
                        <span className="profile-value fade-in">
                          {user?.email || "N/A"}
                        </span>
                      </div>
                      <div className="profile-field">
                        <label className="profile-label">Phone Number:</label>
                        <span className="profile-value fade-in">
                          {user?.phoneNo || "Not Provided"}
                        </span>
                      </div>
                    </>
                  )}
                  {/* Add more fields as needed */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-100 mt-4">
        {user?.posts && user.posts.length > 0 ? (
          <Suspense fallback={<Loading />}>
            <CardContainer cards={user.posts} />
          </Suspense>
        ) : (
          <div className="no-ads-message text-center mt-5">
            <h2>You haven't posted any ads yet.</h2>
            <p>Start posting ads to see them here.</p>
          </div>
        )}
      </div>

      {showUploadForm && (
        <div className="upload-form-container">
          <form onSubmit={handleUpload} className="upload-form">
            <div
              className="drop-area"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => document.getElementById("fileInput").click()}
            >
              <p>Drag & Drop or Click to Upload</p>
              {preview ? (
                <img src={preview} alt="Preview" className="preview-image" />
              ) : (
                <p>📁 Choose an image</p>
              )}
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
            <div className="upload-icons">
              <button
                type="submit"
                disabled={uploading}
                className="btn btn-primary"
              >
                {uploading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowUploadForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
          </>
        )
      }
    </>
  );
};

export default Profile;
