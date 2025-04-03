import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Dropdown,
  DropdownButton,
  Spinner,
} from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./dashboard.css";
import Navbar from "./components/navbar/navbar";

const Applications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [fade, setFade] = useState(false);

  const carouselTexts = useMemo(
    () => [
      "Long press on an application to enable selection mode and delete multiple applications.",
      "Use the filter dropdown to view applications by their status: pending, approved, or rejected.",
      "Click on 'View Details' to see more information about a specific application.",
      "Use the 'Delete' button to remove selected applications from the system.",
    ],
    []
  );

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

  const fetchApplications = useCallback(
    async (status) => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          ...(status !== "all" && { status }),
        }).toString();

        const response = await fetch(
          `http://localhost:3000/admin/applications/get-applications?${queryParams}`,
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
          setApplications(data.applications);
          setHasMore(data.applications.length === 6);
        }
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setLoading(false);
      }
    },
    [navigate, showToastMessage]
  );

  useEffect(() => {
    fetchApplications(statusFilter);
  }, [statusFilter, fetchApplications]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrentSlideIndex(
          (prevIndex) => (prevIndex + 1) % carouselTexts.length
        );
        setFade(false);
      }, 500); // Duration of fade-out
    }, 3000);
    return () => clearInterval(interval);
  }, [carouselTexts]);

  const handleFilterChange = useCallback((status) => {
    setStatusFilter(status);
  }, []);

  const handleLongPress = useCallback((id) => {
    setSelectionMode(true);
    setSelectedIds([id]);
  }, []);

  const handleSelectToggle = useCallback((id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  }, []);

  const handleCancelSelection = useCallback(() => {
    setSelectionMode(false);
    setSelectedIds([]);
  }, []);

  const handleDeleteSelected = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/admin/applications/delete-applications",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: selectedIds }),
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
        setApplications((prev) =>
          prev.filter((app) => !selectedIds.includes(app._id))
        );
        setSelectedIds([]);
        setSelectionMode(false);
        showToastMessage(true, data.message);
      } else {
        showToastMessage(
          false,
          data.message || "Failed to delete applications."
        );
      }
    } catch (error) {
      console.error("Failed to delete applications:", error);
      showToastMessage(false, "An error occurred while deleting applications.");
    }
  }, [navigate, selectedIds, showToastMessage]);

  const ApplicationCard = React.memo(({ app }) => (
    <Col lg={3} md={4} sm={6} xs={12} className="mb-4">
      <div
        className={`border p-3 rounded d-flex flex-column justify-content-between ${
          selectionMode && selectedIds.includes(app._id)
            ? "bg-primary text-white"
            : ""
        }`}
        style={{ height: "300px", cursor: "pointer" }}
        onContextMenu={(e) => {
          e.preventDefault();
          handleLongPress(app._id);
        }}
        onClick={() => selectionMode && handleSelectToggle(app._id)}
      >
        <h5 className="text-center">{app.fullName || "Anonymous User"}</h5>
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
          {app.description || "No description available."}
        </p>
        <div className="d-flex justify-content-between">
          <p className="text-muted mb-0">Issue: {app.issue}</p>
          <p className={`text-${app.status} mb-0`}>Status: {app.status}</p>
        </div>
        {!selectionMode && (
          <button
            className="bg-nav rounded text-light border-0 px-3 py-1 mt-2"
            onClick={() => navigate(`/admin/applications/${app._id}`)}
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
        <div className="text-carousel-container d-flex flex-column justify-content-center align-items-center mb-4">
          <h2 className="text-carousel-heading mb-3">Admin Operations Guide</h2>
          <p
            className={`text-carousel-paragraph text-center mb-4 ${
              fade ? "fade-out" : "fade-in"
            }`}
          >
            {carouselTexts[currentSlideIndex]}
          </p>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Applications</h2>
          {selectionMode ? (
            <div className="d-flex gap-2">
              <button
                className="bg-nav rounded text-light border-0 px-3 py-1"
                onClick={handleCancelSelection}
              >
                Cancel
              </button>
              <button
                className="bg-danger rounded text-light border-0 px-3 py-1"
                onClick={handleDeleteSelected}
                disabled={selectedIds.length === 0}
              >
                Delete ({selectedIds.length})
              </button>
            </div>
          ) : (
            <DropdownButton
              id="status-filter"
              title={`Filter: ${
                statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)
              }`}
              onSelect={handleFilterChange}
            >
              <Dropdown.Item eventKey="all">All</Dropdown.Item>
              <Dropdown.Item eventKey="pending">Pending</Dropdown.Item>
              <Dropdown.Item eventKey="approved">Approved</Dropdown.Item>
              <Dropdown.Item eventKey="rejected">Rejected</Dropdown.Item>
            </DropdownButton>
          )}
        </div>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center">
            <p>No applications found.</p>
          </div>
        ) : (
          <Row>
            {applications.map((app) => (
              <ApplicationCard key={app._id} app={app} />
            ))}
          </Row>
        )}
        {!hasMore && !loading && applications.length > 0 && (
          <div className="text-center mt-3">
            <p>All applications are loaded now.</p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Applications;
