import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import categoriesData from "../../data/categories";

const TopMenu = ({ onFilterChange, category, hasPermission }) => {
  const [startPrice, setStartPrice] = useState("");
  const [lastPrice, setLastPrice] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [subcategories, setSubcategories] = useState([]);

  const showToast = (type, message) => {
    if (type === "error") {
      toast.error(message);
    } else if (type === "success") {
      toast.success(message);
    }
  };

  const handleFilterChange = () => {
    if (!hasPermission) {
      showToast("error", "Please Apply Any filter");
      return;
    }

    if (startPrice && lastPrice && Number(startPrice) > Number(lastPrice)) {
      showToast("error", "Start price cannot be greater than last price!");
      return;
    }

    const newFilters = {
      startPrice,
      lastPrice,
      subcategory: selectedSubcategory,
    };
    if (
      newFilters.startPrice !== "" ||
      newFilters.lastPrice !== "" ||
      newFilters.subcategory !== ""
    ) {
      onFilterChange(newFilters); // Directly invoke onFilterChange
      showToast("success", "Filters applied successfully!");
    } else {
      showToast("error", "No new filters to apply!");
    }
  };

  useEffect(() => {
    const categoryData = categoriesData.find(
      (cat) => cat.category === category
    );
    setSubcategories(categoryData ? categoryData.items : []);
    setSelectedSubcategory(""); // Reset subcategory when category changes
  }, [category]);

  useEffect(() => {
    if (selectedSubcategory) {
      onFilterChange({ subcategory: selectedSubcategory }); // Directly invoke onFilterChange
    }
  }, [selectedSubcategory]);

  return (
    <div className="container my-3 p-3 bg-light rounded shadow-sm">
      <ToastContainer />
      <div className="row g-2 align-items-center">
        <div className="col-auto">
          <select
            className="form-select form-select-sm"
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory} value={subcategory}>
                {subcategory}
              </option>
            ))}
          </select>
        </div>
        <div className="col-auto">
          <input
            type="number"
            placeholder="Start Price"
            value={startPrice}
            onChange={(e) => setStartPrice(e.target.value)}
            className="form-control form-control-sm"
          />
        </div>
        <div className="col-auto">
          <input
            type="number"
            placeholder="Last Price"
            value={lastPrice}
            onChange={(e) => setLastPrice(e.target.value)}
            className="form-control form-control-sm"
          />
        </div>
        <div className="col-auto">
          <button
            onClick={handleFilterChange}
            className="btn btn-primary btn-sm"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopMenu;
