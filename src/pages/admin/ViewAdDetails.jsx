import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import "./ViewAdDetails.css";

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/admin/ads";

const ViewAdDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/admin/ads/get-ad/${id}`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch ad details");
        }
        const data = await response.json();
        setAd(data.ad);
      } catch (err) {
        setError("Failed to load advertisement details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdDetails();
  }, [id]);

  const handleStatusToggle = async () => {
    try {
      const endpoint =
        ad.status === "active"
          ? `${BASE_URL}/admin/ads/inactivate-ad/${id}`
          : `${BASE_URL}/admin/ads/activate-ad/${id}`;
      const response = await fetch(endpoint, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to update ad status");
      }
      const data = await response.json();
      setAd(data.ad);
    } catch (err) {
      alert("Failed to update ad status.");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${BASE_URL}/delete-ad/${id}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to delete ad");
      }
      alert("Ad deleted successfully.");
      navigate("/ads");
    } catch (err) {
      alert("Failed to delete ad.");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
   <>
    <nav className="navbar bg-nav px-xl-5 px-lg-4 px-md-3 px-sm-2 px-1 py-2 d-flex justify-content-between align-items-center">
            <img
              src="/images/logo2.png"
              alt="Brand Logo"
              className="logo-2 cursor-pointer"
              onClick={() => navigate("/admin/dashboard")}
            />
            <div className="d-flex gap-3">
              <div
                onClick={() => navigate(-1)}
                className="nav-link px-3 py-1 m-0 cursor-pointer text-light"
              >
                Back
              </div>
              <div
                onClick={() => navigate("/admin/dashboard")}
                className="nav-link px-3 py-1 m-0 cursor-pointer text-light"
              >
                Home
              </div>
            </div>
          </nav>
          <Navbar />
   <div className="ad-details-container">
      <div className="ad-header">
        <h1>{ad.title}</h1>
        <p className="ad-category">
          {ad.category} - {ad.subCategory}
        </p>
      </div>
      <div className="ad-body">
        <img
          src={ad.image?.url || "/placeholder.jpg"}
          alt={ad.title}
          className="ad-image"
        />
        <div className="ad-info">
          <p>
            <strong>Price:</strong> ${ad.price}
          </p>
          <p>
            <strong>Condition:</strong> {ad.condition}
          </p>
          <p>
            <strong>Description:</strong> {ad.description}
          </p>
          <p>
            <strong>Contact:</strong>{" "}
            {ad.showNumber ? ad.contactNumber : "Hidden"}
          </p>
          <p>
            <strong>Status:</strong> {ad.status}
          </p>
          <p>
            <strong>Posted By:</strong> {ad.postedBy?.name || "Unknown"}
          </p>
          <p>
            <strong>Posted On:</strong>{" "}
            {new Date(ad.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="ad-actions">
        {ad.status === "sold" ? (
          <button className="delete-button" onClick={handleDelete}>
            Delete Ad
          </button>
        ) : (
          <button className="status-button" onClick={handleStatusToggle}>
            {ad.status === "active" ? "Mark as Inactive" : "Mark as Active"}
          </button>
        )}
      </div>
    </div>
   </>
  );
};

export default ViewAdDetails;
