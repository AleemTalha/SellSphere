import React, { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./profile.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUpload, FaCamera } from "react-icons/fa";
import Card from "../../../components/card/Card";

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
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
        if (response.ok) {
          setUser(result.user);
          setLoading(false); // Set loading to false after data is fetched
        } else {
          toast.error(result.message || "Failed to fetch user data");
          setLoading(false); // Set loading to false even if there's an error
        }
      } catch (error) {
        toast.error("Failed to fetch user data: " + error.message);
        setLoading(false); // Set loading to false in case of an error
      }
    };
    fetchUserData();
  }, [id]);

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageClick = () => {
    setShowUploadForm(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
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

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/update/profile/image`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );
      const result = await response.json();
      if (response.ok) {
        toast.success("Profile image updated successfully");
        setUser((prevUser) => ({
          ...prevUser,
          profileImage: result.profileImage,
        }));
        setShowUploadForm(false);
      } else {
        toast.error(result.message || "Failed to upload image");
      }
    } catch (error) {
      toast.error("Failed to upload image: " + error.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <nav className="bg-nav navbar navbar-expand-lg navbar-light">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">
            <img src="/images/logo2.png" alt="Logo" className="logo-2" />
          </NavLink>
          <div className="d-flex">
            <NavLink to="/" className="btn btn-outline-primary me-2">
              Home
            </NavLink>
            <NavLink to="/profile" className="btn btn-outline-secondary">
              Profile
            </NavLink>
          </div>
        </div>
      </nav>

      <div className="profile-container">
        <div className="profile-content">
          <div className="row align-items-center">
            <div className="col-md-4 text-center">
              {loading ? (
                <div className="skeleton skeleton-image"></div>
              ) : (
                <div className="profile-image-container">
                  <img
                    src={user?.profileImage?.url || "/images/default.png"}
                    alt="Profile"
                    className="profile-image fade-in"
                    onLoad={handleImageLoad}
                    onClick={handleImageClick}
                  />
                  <div
                    style={{
                      backgroundColor: "#3f7d58cc",
                    }}
                    className="upload-icon-overlay text-light w-100 h-100 rounded-circle d-flex justify-content-center align-items-center"
                  >
                    <FaCamera onClick={handleImageClick} className="fs-3" />
                  </div>
                </div>
              )}
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
                <img src={preview} alt="Preview" />
              ) : (
                <p>📁 Choose an image</p>
              )}
              <input
                type="file"
                id="fileInput"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
            <div className="upload-icons">
              <button type="submit">Upload</button>
              <button type="button" onClick={() => setShowUploadForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="card-list">
        <Card
          imageUrl="https://via.placeholder.com/150"
          title="Sample Product 1"
          price="19.99"
        />
        <Card
          imageUrl="https://via.placeholder.com/150"
          title="Sample Product 2"
          price="29.99"
        />
        <Card
          imageUrl="https://via.placeholder.com/150"
          title="Sample Product 3"
          price="39.99"
        />
        <Card
          imageUrl="https://via.placeholder.com/150"
          title="Sample Product 4"
          price="49.99"
        />
      </div>
    </>
  );
};

export default Profile;
