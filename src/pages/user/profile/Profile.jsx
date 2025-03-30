import React, { useState, useEffect, lazy, Suspense } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./profile.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCamera } from "react-icons/fa";
import Loading from "../../../components/loading";
import Card from "../../../components/card/card";

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
  const [lastPostId, setLastPostId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [bottomLoading, setBottomLoading] = useState(false);
  const [lastOne, setLastOne] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

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

  const fetchUserData = async (isInitial = false) => {
    if (lastOne || bottomLoading) return; // Prevent fetching if all posts are loaded or already loading
    if (isInitial) setLoading(true); // Set loading to true for the initial fetch
    setBottomLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/profile/profile-id/${id}${
          lastPostId ? "/" + lastPostId : ""
        }`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const result = await response.json();
      if(response.status === 403) {
        showToastMessage(false, "You are not authorized to view this profile.");
        navigate("/error");
        return<>
        </>;
      }
      if (response.ok) {
        setPosts((prevPosts) => [...prevPosts, ...result.user.posts]);
        if (result.user.posts.length > 0) {
          setLastPostId(result.user.posts[result.user.posts.length - 1]._id);
        }
        setLastOne(result.lastOne); 
        if (isInitial) {
          setImgUrl(result.user.profileImage?.url || "/images/default.png");
          setUser(result.user);
        }
      } else {
        showToastMessage(false, result.message || "Failed to fetch posts");
      }
    } catch (error) {
      showToastMessage(false, "Failed to fetch posts: " + error.message);
    } finally {
      if (isInitial) setLoading(false); // Stop loading after the initial fetch
      setBottomLoading(false);
    }
  };

  useEffect(() => {
      document.title = "SellSphere - Your Profile"    
    }, [])

  useEffect(() => {
    fetchUserData(true);
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

  const fetchMorePosts = async () => {
    if (lastOne || loadingMore) return; // Prevent fetching if all posts are loaded or already loading
    setLoadingMore(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/profile/profile-id/${id}${
          lastPostId ? "/" + lastPostId : ""
        }`,
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
        setPosts((prevPosts) => [...prevPosts, ...result.user.posts]);
        if (result.user.posts.length > 0) {
          setLastPostId(result.user.posts[result.user.posts.length - 1]._id);
        }
        setLastOne(result.lastOne);
      } else {
        showToastMessage(false, result.message || "Failed to fetch more posts");
      }
    } catch (error) {
      showToastMessage(false, "Failed to fetch more posts: " + error.message);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleCardHidden = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  return (
    <>
      <ToastContainer />

      {isUser ? (
        <div className="profile-nav">this will be empty</div>
      ) : (
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
            <div
              className="collapse navbar-collapse text-center "
              id="navbarNav"
            >
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <NavLink
                    to="/"
                    className="nav-link bg-nav text-light me-2 text-decoration-none"
                  >
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
          <div className="banner-section bg-transparent text-center">
            <div
              className="banner-content p-4 rounded"
              style={{
                backgroundColor: "transparent",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0)",
              }}
            >
              <h2
                className="banner-title"
                style={{ color: "#3f7d58", fontWeight: "bold" }}
              >
                Sell Faster with Better Listings!
              </h2>
              <p
                className="banner-quote mt-3"
                style={{ fontStyle: "italic", color: "#6c757d" }}
              >
                "Increase your chances of selling by adding high-quality images
                and detailed descriptions. A great listing attracts more
                buyers!"
              </p>
            </div>
          </div>

          <div className="profile-container w-100 bg-transparent d-flex justify-content-center align-items-center">
            <div className="profile-content w-100">
              <div className="row align-items-center">
                <div className="col-md-4 text-center">
                  <div className="profile-image-container">
                    {imageLoading ? (
                      <div className="skeleton profile-skeleton-img"></div>
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
                            <label className="profile-label">
                              Phone Number:
                            </label>
                            <span className="profile-value fade-in">
                              {user?.phoneNo || "Not Provided"}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                    {/* Action Buttons */}
                    <div className="profile-actions mt-4">
                      <button
                        className="btn btn-success py-1 px-3 me-3"
                        onClick={() => navigate("/post-ads")}
                      >
                        Post Ads
                      </button>
                      <button
                        className="btn py-1 px-2"
                        style={{border: "1px solid #3f7d58", color: "#3f7d58"}}
                        onClick={() => navigate("/edit-profile")}
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="left-section my-5">
            <div
              className="features-box p-4 rounded"
              style={{
                backgroundColor: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                maxWidth: "100% ",
                marginLeft: "20px",
                padding: "20px",
              }}
            >
              <h4
                className="text-center mb-4"
                style={{
                  color: "#3f7d58",
                  fontWeight: "bold",
                  borderBottom: "2px solid #3f7d58",
                  paddingBottom: "10px",
                }}
              >
                Tips to Boost Your Ads
              </h4>
              <ul className="list-unstyled">
                <li className="mb-3">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Use high-quality, clear images to attract buyers.
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Write detailed and engaging descriptions for your ads.
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Set competitive and realistic pricing for your products.
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Share your ads on social media platforms for better reach.
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Respond quickly to inquiries to build trust with buyers.
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Regularly update your ads to keep them fresh and relevant.
                </li>
              </ul>
              <div className="text-center mt-4">
                <button
                  className="btn text-nav"
                  onClick={() => navigate("/post-ads")}
                  style={{
                    fontWeight: "bold",
                    padding: "10px 20px",
                    borderRadius: "25px",
                    border: "1px solid #3f7d58",
                  }}
                >
                  Start Posting Ads
                </button>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center">
            {posts && posts.length > 0 ? (
              <div className="row">
                {posts.map((post) => (
                  <div className="" key={post._id}>
                    <Card
                      postId={post._id}
                      image={post.image.url}
                      title={post.title}
                      price={post.price}
                      description={post.description}
                      onCardHidden={handleCardHidden}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center mt-5">
                <h2>You haven't posted any ads yet.</h2>
                <p>Start posting ads to see them here.</p>
              </div>
            )}
          </div>

          {!lastOne && posts.length > 0 && (
            <div className="text-center mt-4">
              {bottomLoading ? (
                <div className="spinner-container d-flex justify-content-center align-items-center">
                  <div
                    className="spinner-grow text-primary"
                    role="status"
                    style={{ width: "3rem", height: "3rem" }}
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <button
                  className="btn btn-primary bg-nav border-0"
                  onClick={() => fetchUserData(false)}
                >
                  Load More
                </button>
              )}
            </div>
          )}
        </>
      )}

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
                <p>Choose an image</p>
              )}
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
            <div className="upload-icons d-flex justify-content-between mt-3 gap-5">
              <button
                type="submit"
                disabled={uploading}
                className="border bg-nav w-50"
              >
                {uploading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Uploading ...
                  </>
                ) : (
                  "Upload"
                )}
              </button>
              <button
                type="button"
                className="bg-nav w-50"
                onClick={() => setShowUploadForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Profile;
