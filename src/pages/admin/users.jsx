import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Spinner, Form, Button } from "react-bootstrap";
import Navbar from "./components/navbar/navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

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

  const fetchUsers = useCallback(
    async (page, status = "") => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({ page, status }).toString();

        const response = await fetch(
          `http://localhost:3000/admin/users?${queryParams}`,
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
          setUsers(data.users);
          setCurrentPage(data.currentPage);
          setTotalPages(data.totalPages);
        } else {
          showToastMessage(false, data.message || "Failed to fetch users.");
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
        showToastMessage(false, "An error occurred while fetching users.");
      } finally {
        setLoading(false);
      }
    },
    [navigate, showToastMessage]
  );

  useEffect(() => {
    fetchUsers(currentPage, statusFilter);
  }, [currentPage, statusFilter, fetchUsers]);

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
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
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Users</h2>
          <Form.Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="w-auto"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Form.Select>
        </div>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center">
            <p>No users found.</p>
          </div>
        ) : (
          <Row>
            {users.map((user) => (
              <Col lg={4} md={6} sm={12} key={user._id} className="mb-4">
                <div className="border p-3 rounded">
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={user.profileImage?.url || "/images/default.png"}
                      alt="Profile"
                      className="rounded-circle me-3 border border-3 border-danger"
                      style={{ width: "50px", height: "50px" }}
                    />
                    <div>
                      <h5 className="mb-0">{user.fullname}</h5>
                      <p className="text-muted mb-0">{user.email}</p>
                    </div>
                  </div>
                  <p className="mb-1">
                    <strong>Phone:</strong> {user.phoneNo || "N/A"}
                  </p>
                  <p className="mb-1">
                    <strong>Location:</strong>{" "}
                    {user.location?.coordinates?.join(", ") || "N/A"}
                  </p>
                  <p className="mb-1">
                    <strong>Status:</strong> {user.status}
                  </p>
                  <Button
                    variant="primary"
                    className="mt-2"
                    onClick={() => navigate(`/admin/users/${user._id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </Col>
            ))}
          </Row>
        )}
        {currentPage < totalPages && (
          <div className="text-center mt-4">
            <Button onClick={handleLoadMore} disabled={loading}>
              {loading ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Users;
