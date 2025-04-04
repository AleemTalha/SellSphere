import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/navbar/navbar";

const Ads = () => {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const fetchCalled = useRef(false);
  const [selectedAds, setSelectedAds] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);

  const showToastMessage = useCallback((flag, message) => {
    toast(message, {
      type: flag ? "success" : "error",
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }, []);

  const fetchAds = useCallback(
    async (page, isLoadMore = false) => {
      try {
        if (isLoadMore) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        const queryParams = new URLSearchParams({ page }).toString();

        const response = await fetch(
          `http://localhost:3000/admin/ads/get-ads?${queryParams}`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.status === 401) {
          showToastMessage(
            false,
            "Request timed out. Your session has expired. Please login again."
          );
          navigate("/login");
          return;
        }

        const data = await response.json();

        if (data.success) {
          setAds((prev) => [...prev, ...data.ads]);
          setCurrentPage(data.currentPage);
          setTotalPages(data.totalPages);
        } else {
          showToastMessage(false, data.message || "Failed to fetch ads.");
        }
      } catch (error) {
        console.error("Failed to fetch ads:", error);
        showToastMessage(false, "An error occurred while fetching ads.");
      } finally {
        if (isLoadMore) {
          setLoadingMore(false);
        } else {
          setLoading(false);
        }
      }
    },
    [navigate, showToastMessage]
  );

  useEffect(() => {
    if (!fetchCalled.current) {
      fetchAds(currentPage);
      fetchCalled.current = true;
    }
  }, [currentPage, fetchAds]);

  const handleLoadMore = useCallback(() => {
    if (currentPage < totalPages) {
      fetchAds(currentPage + 1, true);
    }
  }, [currentPage, totalPages, fetchAds]);

  const handleRightClick = (e, adId) => {
    e.preventDefault();
    setIsSelecting(true);
    setSelectedAds((prev) =>
      prev.includes(adId) ? prev.filter((id) => id !== adId) : [...prev, adId]
    );
  };

  const handleLeftClick = (adId) => {
    if (isSelecting) {
      setSelectedAds((prev) =>
        prev.includes(adId) ? prev.filter((id) => id !== adId) : [...prev, adId]
      );
    }
  };

  const deleteSelectedAds = async () => {
    if (selectedAds.length === 0) {
      showToastMessage(false, "No ads selected for deletion.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:3000/admin/ads/delete-ads",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: selectedAds }),
        }
      );

      const data = await response.json();

      if (data.success) {
        showToastMessage(true, data.message);
        setAds((prev) => prev.filter((ad) => !selectedAds.includes(ad._id)));
        setSelectedAds([]);
        setIsSelecting(false);
      } else {
        showToastMessage(false, data.message || "Failed to delete ads.");
      }
    } catch (error) {
      console.error("Failed to delete ads:", error);
      showToastMessage(false, "An error occurred while deleting ads.");
    } finally {
      setLoading(false);
    }
  };

  const cancelSelection = () => {
    setIsSelecting(false);
    setSelectedAds([]);
  };

  const AdCard = React.memo(({ ad }) => (
    <Col
      lg={3}
      md={4}
      sm={6}
      xs={12}
      className={`mb-4 ${
        selectedAds.includes(ad._id) ? "bg-secondary text-light" : ""
      }`}
      onContextMenu={(e) => handleRightClick(e, ad._id)}
      onClick={() => handleLeftClick(ad._id)}
    >
      <div
        className={`border p-3 rounded d-flex flex-column justify-content-between ${
          isSelecting && selectedAds.includes(ad._id)
            ? "bg-primary text-white"
            : ""
        }`}
        style={{ height: "400px", cursor: "pointer" }}
      >
        <div className="text-center mb-3">
          <img
            src={ad.image?.url || "/images/placeholder.png"}
            alt={ad.title || "Ad Image"}
            className="img-fluid rounded"
            style={{ maxHeight: "150px", objectFit: "cover" }}
          />
        </div>
        <h5
          className="text-center"
          style={{
            // overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            height: "1.5em",
            lineHeight: "1.5em",
          }}
        >
          {ad.title?.length > 15
            ? `${ad.title.slice(0, 15)}...`
            : ad.title || "Untitled Ad"}
        </h5>
        <p
          className="text-muted bg-light p-2 rounded"
          style={{
            minHeight: "60px",
            maxHeight: "60px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {ad.description || "No description available."}
        </p>
        <div className="d-flex justify-content-between flex-column">
          <p className="text-muted mb-0">Price: ${ad.price || "N/A"}</p>
          <p className="text-muted mb-0">
            Contact: {ad.contactNumber || "N/A"}
          </p>
          <p className="text-muted mb-0">Status: {ad.status || "Unknown"}</p>
        </div>
        {!isSelecting && (
          <button
            className="bg-nav rounded text-light border-0 px-3 py-1 mt-2"
            onClick={() => navigate(`/admin/ads/${ad._id}`)}
          >
            View Details
          </button>
        )}
      </div>
    </Col>
  ));

  return (
    <div>
      <ToastContainer />
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
      <Container className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Ads</h2>
          {isSelecting ? (
            <div className="d-flex gap-2">
              <button
                className="bg-nav rounded text-light border-0 px-3 py-1"
                onClick={cancelSelection}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="bg-danger rounded text-light border-0 px-3 py-1"
                onClick={deleteSelectedAds}
                disabled={loading || selectedAds.length === 0}
              >
                Delete ({selectedAds.length})
              </button>
            </div>
          ) : null}
        </div>
        {loading && currentPage === 1 ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : ads.length === 0 ? (
          <div className="text-center">
            <p>No ads found.</p>
          </div>
        ) : (
          <Row>
            {ads.map((ad) => (
              <AdCard key={ad._id} ad={ad} />
            ))}
          </Row>
        )}
        {currentPage < totalPages && (
          <div className="text-center mt-4">
            <button
              className="btn btn-primary"
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <Spinner
                  animation="border"
                  size="sm"
                  role="status"
                  className="me-2"
                />
              ) : null}
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Ads;
