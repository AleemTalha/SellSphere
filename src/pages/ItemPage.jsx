import React from "react";
import { useParams } from "react-router-dom";
import Categories from "../data/categories";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import slugify from "slugify";

const unslugify = (text) => {
  return text.replace(/-/g, " ");
};

const ItemPage = () => {
  const { category, subcategory } = useParams();
  const categoryName = unslugify(category);
  const subcategoryName = unslugify(subcategory);

  const categoryData = Categories.find(
    (cat) => slugify(cat.category, { lower: true }) === category
  );

  if (!categoryData) {
    return (
      <div>
        <h1>404 Not Found</h1>
        <p>Category not found</p>
      </div>
    );
  }

  const subcategoryData = categoryData.items.find(
    (item) => slugify(item, { lower: true }) === subcategory
  );

  if (!subcategoryData) {
    return (
      <div>
        <h1>404 Not Found</h1>
        <p>Subcategory not found</p>
      </div>
    );
  }

  return (
    <div>
      <h1>{categoryName}</h1>
      <h2>{subcategoryName}</h2>
      <p>
        Displaying items for {subcategoryName} in {categoryName}
      </p>
      <ToastContainer />
    </div>
  );
};

export default ItemPage;
