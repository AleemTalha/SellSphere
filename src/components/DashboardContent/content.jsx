import React, { useState, useEffect } from "react";
import "./content.css";
import Search from "../userSearch/search"

const bg1 = "/images/bg-image-2.webp";
const bg2 = "/images/bg-image.webp";
const bg3 = "/images/loginform.webp";

const Content = () => {
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
      heading: "Your Marketplace, Your Rules!",
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

  return (
    <div>
      <div
        className={`dashboard-content ${fade ? "fade-out" : "fade-in"}`}
        style={{
          backgroundImage: `url(${slides[currentSlide].image})`,
        }}
      >
        <div className="hero-section">
          <div className="hero-inside d-flex justify-content-center align-items-center">
            <div>
              <div className="border-text text-light scale-in">
                <h2 className="p-0 m-0">{slides[currentSlide].heading}</h2>
                <p className="p-0 m-0">{slides[currentSlide].text}</p>
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
      <div className="content-section">
        </div>
    </div>
  );
};

export default Content;
