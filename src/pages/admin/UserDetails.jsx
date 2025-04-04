import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Spinner, Button } from "react-bootstrap";
import Navbar from "./components/navbar/navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/admin/users/single/${id}`,
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
          setUser(data.data);
        } else {
          toast.error(data.message || "Failed to fetch user details.", {
            position: "top-center",
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        toast.error("An error occurred while fetching user details.", {
          position: "top-center",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id, navigate]);

  const handleBlockUnblock = async (action) => {
    try {
      setActionLoading(true);
      const endpoint =
        action === "block"
          ? `http://localhost:3000/admin/users/block/${id}`
          : `http://localhost:3000/admin/users/unblock/${id}`;
      const response = await fetch(endpoint, {
        method: action === "block" ? "GET" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message, {
          position: "top-center",
          autoClose: 3000,
        });
        setUser((prevUser) => ({
          ...prevUser,
          status: action === "block" ? "inactive" : "active",
        }));
      } else {
        toast.error(data.message || "Action failed.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Failed to update user status:", error);
      toast.error("An error occurred while updating user status.", {
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
          onClick={() => navigate("/admin/users")}
          className="mb-3 px-3 py-2 rounded bg-nav text-light border-0"
        >
          Back to Users
        </button>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : user ? (
          <div className="border p-4 rounded">
            <div className="d-flex align-items-center mb-4">
              <img
                src={user.profileImage?.url || "/images/default.png"}
                alt="Profile"
                className="rounded-circle me-3 border border-3 border-primary"
                style={{ width: "100px", height: "100px" }}
              />
              <div>
                <h3 className="mb-0">{user.fullname}</h3>
                <p className="text-muted mb-0">{user.email}</p>
              </div>
            </div>
            <p>
              <strong>Phone:</strong> {user.phoneNo || "N/A"}
            </p>
            <p>
              <strong>Location:</strong>{" "}
              {user.location?.coordinates?.join(", ") || "N/A"}
            </p>
            <p>
              <strong>Status:</strong> {user.status}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(user.createdAt).toLocaleString()}
            </p>
            <div className="mt-3">
              {user.status === "active" ? (
                <Button
                  variant="danger"
                  onClick={() => handleBlockUnblock("block")}
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
                    "Block User"
                  )}
                </Button>
              ) : (
                <Button
                  variant="success"
                  onClick={() => handleBlockUnblock("unblock")}
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
                    "Unblock User"
                  )}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p>User not found.</p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default UserDetails;
