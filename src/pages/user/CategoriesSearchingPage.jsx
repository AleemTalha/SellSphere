import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import TopMenu from "../../components/categorieCard/topMenu";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginNav from "../../components/loginNav/navbar";
import Card from "../../components/categorieCard/card";
import "./CategoriesSearchingPage.css";

const CategoriesSearchingPage = () => {
  let { category, subcategory } = useParams();
  const [formattedCategory, setFormattedCategory] = useState("");
  const [formattedSubcategory, setFormattedSubcategory] = useState("");
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    startPrice: "",
    lastPrice: "",
    subcategory: "",
  });
  const [loading, setLoading] = useState(false);
  const [firstId, setFirstId] = useState(null);
  const [lastId, setLastId] = useState(null);
  const [noMoreAds, setNoMoreAds] = useState(false);
  const navigate = useNavigate();

  // Toast notification function
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

  // Function to unslugify the category and subcategory
  function unslugify(str) {
    return str
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  useEffect(() => {
    const formattedCat = unslugify(category);
    setFormattedCategory(formattedCat);

    if (subcategory) {
      const formattedSub = unslugify(subcategory);
      setFormattedSubcategory(formattedSub);
      setFilters((prevFilters) => ({
        ...prevFilters,
        subcategory: formattedSub,
      }));
    } else {
      setFormattedSubcategory("");
      setFilters((prevFilters) => ({
        ...prevFilters,
        subcategory: "",
      }));
    }
  }, [category, subcategory]);

  // Fetch data from backend based on the filter and append if necessary
  const fetchData = async (queryFilters, append = false) => {
    setLoading(true);
    const API_URI = import.meta.env.VITE_API_URI || "http://localhost:3000";
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
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
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
  }, [filters]);

  // Handle changes in filters (price range or subcategory)
  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
    setData([]); // Clear the current data when filters are changed
    setFirstId(null); // Reset firstId when filters change
    setLastId(null); // Reset lastId when filters change
    setNoMoreAds(false); // Reset the noMoreAds flag
  };

  // Handle Load More button click
  const handleLoadMore = () => {
    if (!noMoreAds) {
      fetchData(filters, true);
    }
  };

  return (
    <div>
      <ToastContainer />
      <LoginNav />
      <TopMenu
        onFilterChange={handleFilterChange}
        category={formattedCategory}
      />
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
          <div className="row">
            {data.map((ad) => (
              <div className="col-md-6" key={ad._id}>
                <Card ad={ad} />
              </div>
            ))}
          </div>
        )}
        <div className="text-center my-3">
          {!noMoreAds && data.length > 0 && (
            <button
              className="btn btn-primary"
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? "Loading..." : "Load More"}
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
