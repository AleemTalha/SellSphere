import React from "react";
import "./content.css";
const Content = (props) => {
  return (
    <>
      <div className="dashboard-content">
        <div
          className="hero-section border"
          style={{ backgroundImage: ``, minHeight: "100vh" }}
        >
          <div className="hero-inside pt-5 px-5">
            <div class="border-text">
              <h2>
                Sell with Ease, Buy with Confidence
                <br /> Connecting You to the Right Deals!
              </h2>
              <p>
                Find What You Need, List What You Have – Hassle-Free & Direct
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Content;
