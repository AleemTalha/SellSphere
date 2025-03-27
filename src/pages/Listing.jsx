import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Listing = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`/api/items?page=${page}&limit=4`);
        const data = await response.json();
        setItems(data);
      } catch (error) {
        toast.error("Error fetching items", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
          newestOnTop: true,
        });
      }
    };

    fetchItems();
  }, [page]);

  const loadMore = () => {
    setPage(page + 1);
  };

  return (
    <div>
      <h1>Item Listing</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <button onClick={loadMore} className="btn btn-primary">
        Load More
      </button>
      <ToastContainer />
    </div>
  );
};

export default Listing;
