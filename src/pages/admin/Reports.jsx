import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/navbar/navbar";
import { formatDistanceToNow } from "date-fns";

const Reports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const fetchCalled = useRef(false); 
  const [selectedReports, setSelectedReports] = useState([]);
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

  const fetchReports = useCallback(
    async (page, isLoadMore = false) => {
      try {
        if (isLoadMore) {
          setLoadingMore(true);
        } else {
          setLoading(true); 
        }

        const queryParams = new URLSearchParams({ page }).toString();

        const response = await fetch(
          `http://localhost:3000/admin/reports/get-reports?${queryParams}`,
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
          setReports((prev) => [...prev, ...data.reports]);
          setCurrentPage(data.currentPage);
          setTotalPages(data.totalPages);
        } else {
          showToastMessage(false, data.message || "Failed to fetch reports.");
        }
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        showToastMessage(false, "An error occurred while fetching reports.");
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
      fetchReports(currentPage);
      fetchCalled.current = true; 
    }
  }, [currentPage, fetchReports]);

  const handleLoadMore = useCallback(() => {
    if (currentPage < totalPages) {
      fetchReports(currentPage + 1, true)
    }
  }, [currentPage, totalPages, fetchReports]);

  const handleRightClick = (e, reportId) => {
    e.preventDefault();
    if (!isSelecting) {
      setIsSelecting(true);
      setSelectedReports([reportId]);
    } else {
      setSelectedReports((prev) =>
        prev.includes(reportId)
          ? prev.filter((id) => id !== reportId)
          : [...prev, reportId]
      );
    }
  };

  const handleLeftClick = (reportId) => {
    if (isSelecting) {
      setSelectedReports((prev) =>
        prev.includes(reportId)
          ? prev.filter((id) => id !== reportId)
          : [...prev, reportId]
      );
    }
  };

  const deleteSelectedReports = async () => {
    if (selectedReports.length === 0) {
      showToastMessage(false, "No reports selected for deletion.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:3000/admin/reports/delete-reports",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: selectedReports }),
        }
      );

      const data = await response.json();

      if (data.success) {
        showToastMessage(true, data.message);
        setReports((prev) =>
          prev.filter((report) => !selectedReports.includes(report._id))
        );
        setSelectedReports([]);
      } else {
        showToastMessage(false, data.message || "Failed to delete reports.");
      }
    } catch (error) {
      console.error("Failed to delete reports:", error);
      showToastMessage(false, "An error occurred while deleting reports.");
    } finally {
      setLoading(false);
    }
  };

  const ReportCard = React.memo(({ report }) => (
    <Col
      lg={3}
      md={4}
      sm={6}
      xs={12}
      className={`mb-4 ${
        selectedReports.includes(report._id) ? "bg-secondary text-light" : ""
      }`}
      onContextMenu={(e) => handleRightClick(e, report._id)}
      onClick={() => handleLeftClick(report._id)}
    >
      <div
        className="border p-3 rounded d-flex flex-column justify-content-between"
        style={{
          height: "300px",
          cursor: "pointer",
          backgroundColor: selectedReports.includes(report._id)
            ? "#343a40"
            : "white",
        }}
      >
        <h5 className="text-center">{report.title || "Untitled Report"}</h5>
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
          {report.description || "No description available."}
        </p>
        <div className="d-flex justify-content-between flex-column">
          <p className="text-muted mb-0">Issue : {report.issue || "Unknown"}</p>

          <p className="text-muted mb-0">
            Created At:{" "}
            {formatDistanceToNow(new Date(report.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>
        <button
          className="bg-nav rounded text-light border-0 px-3 py-1 mt-2"
          onClick={() => navigate(`/admin/reports/${report._id}`)}
        >
          View Details
        </button>
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
            className="nav-link px-3 py-1 m-0  cursor-pointer text-light"
          >
            Home
          </div>
        </div>
      </nav>
      <Navbar />
      <Container className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Reports</h2>
          {selectedReports.length > 0 && (
            <button className="btn btn-danger" onClick={deleteSelectedReports}>
              Delete Selected ({selectedReports.length})
            </button>
          )}
        </div>
        {loading && currentPage === 1 ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center">
            <p>No reports found.</p>
          </div>
        ) : (
          <Row>
            {reports.map((report) => (
              <ReportCard key={report._id} report={report} />
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

export default Reports;
