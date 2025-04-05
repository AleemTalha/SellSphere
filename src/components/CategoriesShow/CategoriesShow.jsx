import React from "react";
import categoriesData from "../../data/categories";
import {
  FaCar,
  FaLaptop,
  FaHome,
  FaMobileAlt,
  FaTshirt,
  FaBook,
  FaFootballBall,
  FaSpa,
  FaPuzzlePiece,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import slugify from "slugify";

const iconMap = {
  Cars: <FaCar />,
  Laptops: <FaLaptop />,
  "Home Appliances": <FaHome />,
  "Mobile Phones": <FaMobileAlt />,
  House: <FaHome />,
  Clothing: <FaTshirt />,
  Books: <FaBook />,
  "Sports Equipment": <FaFootballBall />,
  "Beauty Products": <FaSpa />,
  Toys: <FaPuzzlePiece />,
};

const CategoriesShow = () => {
  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Categories</h2>
      <div className="row">
        {categoriesData.map((category, index) => (
          <div
            className="col-6 col-md-4 col-lg-3 mb-3 d-flex align-items-center"
            key={index}
          >
            <div className="d-flex flex-fow align-items-center justify-content-center  w-100 p-3 border rounded shadow-sm bg-light">
              <NavLink
                to={`/category/${slugify(category.category)}`}
                className="d-flex flex-fow align-items-center justify-content-md-start justify-content-center  w-100 text-decoration-none text-dark"
              >
                <div className="me-3 fs-4 text-nav">
                  {iconMap[category.category]}
                </div>
                <div className="fw-bold d-md-block d-none">{category.category}</div>
              </NavLink>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesShow;
