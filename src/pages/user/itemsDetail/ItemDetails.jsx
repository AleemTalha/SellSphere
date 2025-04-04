import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Menu from "../../../components/itemMenu/menu";
import "./ItemDetails.css";
import NavBar from "../../../components/loginNav/navbar";
import ReportMenu from "../../../components/report/report";

const ItemDetails = () => {
  const { id } = useParams();
  const [itemData, setItemData] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const API_URI = import.meta.env.VITE_API_URL + `/dashboard/items/${id}`;
        const response = await fetch(API_URI, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          method: "GET",
        });

        if (response.status === 401) {
          navigate("/login");
          return;
        }

        if (response.status === 403) {
          setError("This page is only accessible to local users.");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setItemData(data.ad);

        if (data.ad.location?.coordinates?.length === 2) {
          const [longitude, latitude] = data.ad.location.coordinates;
          const locationResponse = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const locationData = await locationResponse.json();
          setLocation(locationData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItemData();
  }, [id, navigate]);

  return (
    <>
      <NavBar />
      <div className="container mt-5">
        {loading ? (
          <div className="row">
            <div className="col-md-6 skeleton skeleton-image"></div>
            <div className="col-md-6">
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-price"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text"></div>
            </div>
          </div>
        ) : error ? (
          <div className="container text-danger">Error: {error}</div>
        ) : (
          <>
            <Menu
              category={itemData.category}
              phoneNumber={itemData.contactNumber}
            />
            <div className="row">
              <div className="col-md-6 d-flex justify-content-center align-items-center">
                <img
                  className="item-image"
                  src={itemData.image.url}
                  alt={itemData.title}
                />
              </div>
              <div className="col-md-6 px-5 px-lg-2">
                <h1 className="item-title">{itemData.title}</h1>
                <p className="item-price">
                  Rs {itemData.price.toLocaleString()}
                </p>
                <p className="item-details">
                  <span className="item-details-label">Condition:</span>{" "}
                  {itemData.condition}
                </p>
                <p className="item-details">
                  <span className="item-details-label">Location:</span>{" "}
                  {location
                    ? `${location.city}, ${location.countryName}`
                    : "Fetching location..."}
                </p>
                <p className="item-details">
                  <span className="item-details-label">Contact:</span>{" "}
                  {itemData.showNumber ? itemData.contactNumber : "Hidden"}
                </p>
                <div className="d-flex justify-content-end align-items-center p-2 rounded">
                  <ReportMenu
                    itemId={id}
                    title={itemData.title}
                    createdBy={itemData.createdBy}
                    type={itemData.category}
                    postedBy={itemData.postedBy}
                  />
                </div>
              </div>
            </div>
            {itemData.category === "Cars" && (
              <div className="item-extra-details">
                <p>
                  <span className="item-details-label">Make:</span>
                  {itemData.Make}
                </p>
                <p>
                  <span className="item-details-label">Model:</span>
                  {itemData.Model}
                </p>
                <p>
                  <span className="item-details-label">Year:</span>{" "}
                  {itemData.Year}
                </p>
                <p>
                  <span className="item-details-label">Mileage:</span>
                  {itemData.Mileage} km{" "}
                  <span className="text-muted">(Driven)</span>
                </p>
              </div>
            )}
            {itemData.category === "House" && (
              <div className="item-extra-details">
                <p>
                  <span className="item-details-label">City:</span>{" "}
                  {itemData.locationCity}
                </p>
                <p>
                  <span className="item-details-label">Bedrooms:</span>{" "}
                  {itemData.bedrooms}
                </p>
                <p>
                  <span className="item-details-label">Bathrooms:</span>{" "}
                  {itemData.bathrooms}
                </p>
                <p>
                  <span className="item-details-label">Area:</span>{" "}
                  {itemData.area} sq.ft
                </p>
                <p>
                  <span className="item-details-label">Furnished:</span>{" "}
                  {itemData.furnished ? "Yes" : "No"}
                </p>
              </div>
            )}
            <div className="item-description">
              <p className="item-details-label">Description:</p>
              <p
                dangerouslySetInnerHTML={{
                  __html: itemData.description.replace(/\r\n|\n|\r/g, "<br/>"),
                }}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ItemDetails;
