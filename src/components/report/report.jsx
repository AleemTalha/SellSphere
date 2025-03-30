import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./report.css";

const ReportMenu = ({ itemId, title, createdBy, type, postedBy, text }) => {
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

  const [showReportForm, setShowReportForm] = useState(false);
  const [issue, setIssue] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

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

  const submitReport = async () => {
    if (!issue) {
      setFormError("Please select an issue before submitting.");
      return;
    }
    setFormError("");
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
          setShowReportForm(false);
          showToast("Too many reportings, please try again later.", false);
          return;
        }

        let errorMessage = "Failed to submit report.";
        try {
          const errorData = await response.json();
          errorMessage = errorData?.message || errorMessage;
        } catch {}

        throw new Error(errorMessage);
      }

      showToast("Report submitted successfully!", true);
      setShowReportForm(false);
    } catch (error) {
      setFormError(error.message || "An error occurred while submitting the report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="menu-button bg-nav" onClick={() => setShowReportForm(true)}>
        {text ? text : "report"}
      </button>

      {showReportForm &&
        createPortal(
          <div className="report-popup-overlay">
            <div className="report-popup">
              <h3>Report Item</h3>
              <label>Select issue:</label>
              <div className="radio-group">
                {["Scam", "Fraud", "False Seller", "Sexual Content", "Misleading", "False Information"].map(
                  (item) => (
                    <label key={item}>
                      <input
                        type="radio"
                        value={item}
                        checked={issue === item}
                        onChange={(e) => setIssue(e.target.value)}
                      />
                      {item}
                    </label>
                  )
                )}
              </div>
              <label>Description (optional):</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide more details..."
              />
              {formError && <p className="form-error">{formError}</p>}
              <div className="popup-buttons">
                <button className="bg-nav text-light" onClick={() => setShowReportForm(false)}>
                  Cancel
                </button>
                <button className="bg-nav" onClick={submitReport} disabled={loading}>
                  {loading ? <span className="spinner-border spinner-border-sm"></span> : "Submit"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default ReportMenu;
