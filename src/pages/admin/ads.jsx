import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/navbar/navbar";

const ads = () => {
  const navigate = useNavigate();

  return (
    <div>
      <nav className="navbar px-xl-5 px-lg-4 px-md-3 px-sm-2 px-1 py-2 bg-nav d-flex justify-content-between">
        <div className="">
          <img
            src="/images/logo2.png"
            alt="Brand Logo"
            className="logo-2 cursor-pointer"
            onClick={() => navigate("/admin/dashboard")}
          />
        </div>
        <div className="d-flex gap-3">
          <div
            onClick={() => navigate(-1)}
            className="px-3 py-1 rounded nav-link cursor-pointer elong transition-all text-light hover-effect"
          >
            Back
          </div>
          <div
            onClick={() => navigate("/admin/dashboard")}
            className="px-3 py-1 rounded nav-link cursor-pointer elong transition-all text-light hover-effect"
          >
            Home
          </div>
        </div>
      </nav>
      <Navbar />
      this is our ads page
    </div>
  );
};

export default ads;
