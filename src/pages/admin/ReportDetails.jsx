import React, { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { Container, Spinner, Button } from "react-bootstrap";
import Navbar from "./components/navbar/navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/admin/reports/get-report/${id}`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.status === 401) {
          toast.error(
            "Request timed out. Your session has expired. Please login again.",
            { position: "top-center", autoClose: 3000 }
          );
          navigate("/login");
          return;
        }

        const data = await response.json();

        if (data.success) {
          setReport(data.report);
        } else {
          toast.error(data.message || "Failed to fetch report details.", {
            position: "top-center",
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.error("Failed to fetch report details:", error);
        toast.error("An error occurred while fetching report details.", {
          position: "top-center",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReportDetails();
  }, [id, navigate]);

  const handleAction = async (action) => {
    try {
      setActionLoading(true);
      const endpoint = `http://localhost:3000/admin/reports/${action}-report/${id}`;
      const response = await fetch(endpoint, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message, {
          position: "top-center",
          autoClose: 3000,
        });
        if (action === "delete") {
          navigate("/admin/reports");
        } else {
          setReport((prevReport) => ({
            ...prevReport,
            status: action === "approve" ? "approved" : "rejected",
          }));
        }
      } else {
        toast.error(data.message || "Action failed.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error(`Failed to ${action} report:`, error);
      toast.error(`An error occurred while trying to ${action} the report.`, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer />
      <nav className="navbar px-xl-5 px-lg-4 px-md-3 px-sm-2 px-1 py-2 bg-nav d-flex justify-content-between">
        <div>
          <img
            src="/images/logo2.png"
            alt="Brand Logo"
            className="logo-2 cursor-pointer"
            onClick={() => navigate("/admin/dashboard")}
          />
        </div>
        <div className="d-flex gap-3">
          <div
            onClick={() => navigate(-1)}
            className="px-3 py-1 rounded nav-link cursor-pointer elong transition-all text-light hover-effect"
          >
            Back
          </div>
          <div
            onClick={() => navigate("/admin/dashboard")}
            className="px-3 py-1 rounded nav-link cursor-pointer elong transition-all text-light hover-effect"
          >
            Home
          </div>
        </div>
      </nav>
      <Navbar />
      <Container className="mt-4">
        <button
          onClick={() => navigate("/admin/reports")}
          className="mb-3 px-3 py-2 rounded bg-nav text-light border-0"
        >
          Back to Reports
        </button>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : report ? (
          <div className="border p-4 rounded">
            <h3 className="mb-3">{report.title || "Untitled Report"}</h3>
            <p>
              <strong>Description:</strong> {report.description || "N/A"}
            </p>
            <p>
              <strong>Issue:</strong> {report.issue || "N/A"}
            </p>
            <p>
              <strong>Type:</strong> {report.type || "N/A"}
            </p>
            <p>
              <strong>Item - Id : </strong>{" "}
              <NavLink to={`/admin/ads/${report.id}`}>
                {report.id || "N/A"}
              </NavLink>
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(report.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Last Updated:</strong>{" "}
              {new Date(report.updatedAt).toLocaleString()}
            </p>
            <div className="mt-3 d-flex gap-3">
              {report.status === "pending" ? (
                <>
                  <Button
                    variant="success"
                    onClick={() => handleAction("approve")}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    ) : (
                      "Approve"
                    )}
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleAction("reject")}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    ) : (
                      "Reject"
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  variant="danger"
                  onClick={() => handleAction("delete")}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  ) : (
                    "Delete"
                  )}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p>Report not found.</p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default ReportDetails;
