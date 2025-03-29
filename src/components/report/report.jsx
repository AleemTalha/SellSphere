import React, { useState, useRef, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./report.css";

const ReportMenu = ({ itemId, title, createdBy, type, postedBy }) => {
  const showToast = (message, isSuccess) => {
    const options = {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    };

    isSuccess ? toast.success(message, options) : toast.error(message, options);
  };

  const [showMenu, setShowMenu] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [issue, setIssue] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(""); // State to store form error messages

  const menuRef = useRef(null);
  const formRef = useRef(null);
  const containerRef = useRef(null);

  // **Disable Scroll Bar Visibility on Report Form Open**
  useEffect(() => {
    if (showReportForm) {
      document.body.classList.add("report-form-open");
    } else {
      document.body.classList.remove("report-form-open");
    }

    return () => {
      document.body.classList.remove("report-form-open");
    };
  }, [showReportForm]);

  // **Toggle Report Menu**
  const toggleMenu = () => setShowMenu(!showMenu);

  // **Open Report Form**
  const openReportForm = () => {
    setShowMenu(false);
    setShowReportForm(true);
  };

  // **Close menu/form if clicked outside**
  const handleClickOutside = (e) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.target) &&
      !menuRef.current?.contains(e.target) &&
      !formRef.current?.contains(e.target)
    ) {
      setShowMenu(false);
      setShowReportForm(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const submitReport = async () => {
    if (!issue) {
      setFormError("Please select an issue before submitting.");
      return;
    }
    setFormError(""); // Clear any previous error messages
    setLoading(true);

    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/dashboard/item/report",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            issue,
            createdBy: postedBy,
            type,
            id: itemId,
            description,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          showToast("Unauthorized access. Redirecting to login page...", false);
          setTimeout(() => (window.location.href = "/login"), 2000);
          return;
        }
        if (response.status === 403) {
          setFormError("This functionality is restricted to local users only.");
          return;
        }
        if (response.status === 429) {
          setShowReportForm(false); // Close the report form
          showToast("Too many reportings, please try again later.", false);
          return;
        }

        let errorMessage = "Failed to submit report.";
        try {
          const errorData = await response.json();
          errorMessage = errorData?.message || errorMessage;
        } catch {
          // Handle non-JSON error responses
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      showToast("Report submitted successfully!", true);
      setShowReportForm(false);
    } catch (error) {
      setFormError(
        error.message || "An error occurred while submitting the report."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        
      {showReportForm && <div className="blur-background"></div>}
      <div className="report-container" ref={containerRef}>
        <div className="report-btn-container">
          <button
            className="menu-button bg-nav"
            onClick={toggleMenu}
            ref={menuRef}
          >
            Report
          </button>
          {showMenu && (
            <div className="menu-dropdown">
              <button className="menu-option" onClick={openReportForm}>
                <i className="bi bi-flag"></i> Report
              </button>
            </div>
          )}
        </div>
        {showReportForm && (
          <div className="report-popup" ref={formRef}>
            <h3>Report Item</h3>
            <label>Select issue:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  value="Scam"
                  checked={issue === "Scam"}
                  onChange={(e) => setIssue(e.target.value)}
                />
                Scam
              </label>
              <label>
                <input
                  type="radio"
                  value="Fraud"
                  checked={issue === "Fraud"}
                  onChange={(e) => setIssue(e.target.value)}
                />
                Fraud
              </label>
              <label>
                <input
                  type="radio"
                  value="False Seller"
                  checked={issue === "False Seller"}
                  onChange={(e) => setIssue(e.target.value)}
                />
                False Seller
              </label>
              <h4>Content Issues</h4>
              <label>
                <input
                  type="radio"
                  value="Sexual Content"
                  checked={issue === "Sexual Content"}
                  onChange={(e) => setIssue(e.target.value)}
                />
                Sexual Content
              </label>
              <label>
                <input
                  type="radio"
                  value="Misleading"
                  checked={issue === "Misleading"}
                  onChange={(e) => setIssue(e.target.value)}
                />
                Misleading Information
              </label>
              <label>
                <input
                  type="radio"
                  value="False Information"
                  checked={issue === "False Information"}
                  onChange={(e) => setIssue(e.target.value)}
                />
                False Information
              </label>
            </div>
            <label>Description (optional):</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide more details..."
            />
            {formError && <p className="form-error">{formError}</p>}{" "}
            {/* Display form error */}
            <div className="popup-buttons">
              <button
                className="bg-nav"
                onClick={() => setShowReportForm(false)}
              >
                Cancel
              </button>
              <button
                className="bg-nav"
                onClick={submitReport}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ReportMenu;
