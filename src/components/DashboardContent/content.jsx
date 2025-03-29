import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./content.css";
import Search from "../userSearch/search";
import CategoriesShow from "../CategoriesShow/CategoriesShow";

const bg1 = "/images/bg-image-2.webp";
const bg2 = "/images/bg-image.webp";
const bg3 = "/images/loginform.webp";

const Content = (props) => {
  const navigate = useNavigate();
  const slides = [
    {
      image: bg1,
      heading: "Sell with Ease, Buy with Confidence",
      text: "Find What You Need, List What You Have – Hassle-Free & Direct",
    },
    {
      image: bg2,
      heading: "Discover Amazing Deals Instantly",
      text: "Browse, Compare, and Buy Effortlessly in Just a Click",
    },
    {
      image: bg3,
      heading: `Your Marketplace, Your Rules, Your Way!`,
      text: "List, Negotiate, and Seal the Deal on Your Terms",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(false);

  const nextSlide = () => {
    setFade(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setFade(false);
    }, 500);
  };

  const prevSlide = () => {
    setFade(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setFade(false);
    }, 500);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const scrollMore = () => {
    window.scrollBy({ top: 400, behavior: "smooth" });
  };

  const postAd = () => {
    if (!props?.user) {
      navigate("/login");
    } else {
      navigate("/post-Ads");
    }
  };

  return (
    <div>
      <div
        className={`dashboard-content ${fade ? "fade-out" : "fade-in"}`}
        style={{
          backgroundImage: `url(${slides[currentSlide].image})`,
          maxHeight: "90vh",
          minHeight: "90vh",
          backgroundSize: "cover",
          backgroundPosition: "center",
          overflow: "hidden",
        }}
      >
        <div className="hero-section">
          <div className="hero-inside d-flex justify-content-center align-items-center">
            <div>
              <div className="border-text text-light scale-in mx-0 px-0">
                <h2 className="p-0 m-0">{slides[currentSlide].heading}</h2>
                <p className="p-0 m-0">{slides[currentSlide].text}</p>
                <div className="button-container pt-3 d-flex justify-content-center gap-2 gap-sm-4">
                  <button
                    className="btn px-1 py-1 bg-transparent text-light border"
                    onClick={scrollMore}
                  >
                    Explore More
                  </button>
                  <button
                    className="btn bg-nav text-light  cursor-pointer"
                    onClick={postAd}
                    style={{ zIndex: 2 }}
                  >
                    Post Your Ad
                  </button>
                </div>
              </div>
              <div className="carousel-buttons">
                <button onClick={prevSlide} className="prev-btn">
                  ❮
                </button>
                <button onClick={nextSlide} className="next-btn">
                  ❯
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="search-container p-5">
        <Search />
      </div>
      <div className="categories-container">
        <CategoriesShow />
      </div>
    </div>
  );
};

export default Content;
