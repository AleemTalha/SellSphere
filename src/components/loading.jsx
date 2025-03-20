import React from "react";

const loading = () => {
  return (
    <div>
      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center bg-nav text-btn"
        style={{ zIndex: 1050 }}
      >
        <div className="d-flex">
          <div
            className="spinner-grow text-primary mx-2"
            style={{ width: "3rem", height: "3rem" }}
          ></div>
          <div
            className="spinner-grow text-danger mx-2"
            style={{ width: "3rem", height: "3rem" }}
          ></div>
          <div
            className="spinner-grow text-success mx-2"
            style={{ width: "3rem", height: "3rem" }}
          ></div>
        </div>
        <h2 className="mt-4 fw-bold">Please Wait...</h2>
      </div>
    </div>
  );
};

export default loading;
