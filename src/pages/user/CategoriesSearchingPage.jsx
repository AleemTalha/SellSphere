import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginNav from "../../components/loginNav/navbar";
import Card from "../../components/categorieCard/card";
import categoriesData from "../../data/categories";
import "./CategoriesSearchingPage.css";

const CategoriesSearchingPage = () => {
  let { category, subcategory } = useParams();

  const [formattedCategory, setFormattedCategory] = useState("");
  const [formattedSubcategory, setFormattedSubcategory] = useState("");
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    startPrice: "",
    lastPrice: "",
    subcategory: subcategory ? unslugify(subcategory) : "",
  });
  const [tempFilters, setTempFilters] = useState({
    startPrice: "",
    lastPrice: "",
  });
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    subcategory ? unslugify(subcategory) : ""
  );
  const [loading, setLoading] = useState(false);
  const [firstId, setFirstId] = useState(null);
  const [lastId, setLastId] = useState(null);
  const [noMoreAds, setNoMoreAds] = useState(false);
  const navigate = useNavigate();

  const showToast = (message, isSuccess) => {
    toast(message, {
      type: isSuccess ? "success" : "error",
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  function unslugify(str) {
    return str
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  useEffect(() => {
    setFormattedCategory(unslugify(category));
    if (subcategory) {
      setFormattedSubcategory(unslugify(subcategory));
    }
  }, [category, subcategory]);

  useEffect(() => {
    const formattedCategory = unslugify(category);
    console.log("Formatted Category:", formattedCategory);
    const matchedCategory = categoriesData.find(
      (cat) => cat.category.toLowerCase() === formattedCategory.toLowerCase()
    );
    console.log("Matched Category:", matchedCategory);

    if (matchedCategory) {
      setSubcategories(matchedCategory.items);
      setSelectedSubcategory(subcategory ? unslugify(subcategory) : "");
    } else {
      setSubcategories([]);
      setSelectedSubcategory("");
    }
  }, [category, subcategory]);

  const fetchData = async (queryFilters, append = false) => {
    setLoading(true);
    if (!append) {
      setData([]);
      setFirstId(null);
      setLastId(null);
      setNoMoreAds(false);
    }
    const API_URI = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const queryParams = new URLSearchParams({
      categorie: unslugify(category),
      ...(queryFilters.subcategory && {
        subcategorie: queryFilters.subcategory,
      }),
      ...(queryFilters.startPrice && { startPrice: queryFilters.startPrice }),
      ...(queryFilters.lastPrice && { lastPrice: queryFilters.lastPrice }),
      ...(lastId && { lastId }),
      ...(firstId && { firstId }),
    }).toString();

    const uri = `${API_URI}/dashboard/listings?${queryParams}`;
    try {
      const response = await fetch(uri, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        method: "GET",
      });

      if (response.status === 401) {
        showToast("You are not logged in!", false);
        navigate("/login", { replace: true });
        return;
      }
      const result = await response.json();
      if (result.success) {
        if (result.ads.length === 0) {
          setNoMoreAds(true);
        } else {
          setData((prevData) =>
            append ? [...prevData, ...result.ads] : result.ads
          );
          if (result.ads.length > 0) {
            setFirstId(result.firstId);
            setLastId(result.ads[result.ads.length - 1]._id);
          }
          setNoMoreAds(result.lastAd || result.ads.length === 0);
        }
      } else {
        setNoMoreAds(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filters);
  }, [filters, category, subcategory]);

  const handleFilterChange = (newFilters) => {
    const updatedFilters = {
      ...filters,
      ...newFilters,
    };
    fetchData(updatedFilters);
  };

  const handleLoadMore = () => {
    if (!noMoreAds) {
      fetchData(filters, true);
    }
  };

  const applyFilters = () => {
    if (
      tempFilters.startPrice &&
      tempFilters.lastPrice &&
      Number(tempFilters.lastPrice) < Number(tempFilters.startPrice)
    ) {
      showToast("Last price cannot be less than start price!", false);
      return;
    }

    // Update subcategories dynamically
    if (selectedSubcategory && !subcategories.includes(selectedSubcategory)) {
      setSubcategories((prevSubcategories) => [
        ...prevSubcategories,
        selectedSubcategory,
      ]);
      showToast(`Subcategory "${selectedSubcategory}" added!`, true);
    }

    setFilters({
      ...tempFilters,
      subcategory: selectedSubcategory,
    });
    setFirstId(null);
    setLastId(null);
  };

  return (
    <div>
      <ToastContainer />
      <LoginNav />
      <div className="filter-strip d-flex flex-wrap align-items-center justify-content-center gap-2 p-2 bg-light">
        <select
          className="form-select"
          style={{ maxWidth: "200px", flex: "1 1 auto" }}
          value={selectedSubcategory}
          onChange={(e) => setSelectedSubcategory(e.target.value)}
        >
          <option value="">Select All</option>
          {subcategories.map((subcat, index) => (
            <option key={index} value={subcat}>
              {subcat}
            </option>
          ))}
        </select>
        <input
          type="number"
          className="form-control"
          style={{ maxWidth: "200px", flex: "1 1 auto" }}
          placeholder="Start Price"
          value={tempFilters.startPrice}
          onChange={(e) =>
            setTempFilters({ ...tempFilters, startPrice: e.target.value })
          }
        />
        <input
          type="number"
          className="form-control"
          style={{ maxWidth: "200px", flex: "1 1 auto" }}
          placeholder="Last Price"
          value={tempFilters.lastPrice}
          onChange={(e) =>
            setTempFilters({ ...tempFilters, lastPrice: e.target.value })
          }
        />
        <button
          className="btn bg-nav text-light"
          style={{ maxWidth: "100px", flex: "1 1 auto" }}
          onClick={() => {
            if (
              tempFilters.startPrice &&
              tempFilters.lastPrice &&
              Number(tempFilters.lastPrice) < Number(tempFilters.startPrice)
            ) {
              showToast("Last price cannot be less than start price!", false);
              return;
            }
            applyFilters();
          }}
          disabled={
            tempFilters.startPrice === filters.startPrice &&
            tempFilters.lastPrice === filters.lastPrice &&
            selectedSubcategory === filters.subcategory
          }
        >
          Apply
        </button>
      </div>
      <div className="category-content">
        <h2>
          {formattedCategory}
          {formattedSubcategory && ` > ${formattedSubcategory}`}
        </h2>
        {loading && data.length === 0 ? (
          <div className="text-center my-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : data.length === 0 ? (
          <p>No ads to show</p>
        ) : (
          <div className="row m-0 p-0 w-100">
            {data.map((ad) => (
              <div
                className="col-6 d-flex justify-content-center align-items-center"
                key={ad._id}
              >
                <Card ad={ad} />
              </div>
            ))}
          </div>
        )}
        <div className="text-center my-3">
          {!noMoreAds && data.length > 0 && (
            <button
              className="btn bg-nav text-light"
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Loading...
                </>
              ) : (
                "Load More"
              )}
            </button>
          )}
          {noMoreAds && data.length > 0 && (
            <p className="text-muted">You have reached the end of the list.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesSearchingPage;
