import React, { useRef, useState } from "react";
import Card from "../card/card";
import "./cardContainer.css";

const CardContainer = ({ cards }) => {
  const containerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = (direction) => {
    const scrollAmount = 300;
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
      setTimeout(() => setScrollPosition(containerRef.current.scrollLeft), 300);
    }
  };

  const handleMouseDown = (e) => {
    if (containerRef.current) {
      containerRef.current.style.scrollSnapType = "none";
      containerRef.current.isDragging = true;
      containerRef.current.startX = e.pageX - containerRef.current.offsetLeft;
      containerRef.current.scrollLeftStart = containerRef.current.scrollLeft;
    }
  };

  const handleMouseMove = (e) => {
    if (containerRef.current?.isDragging) {
      const x = e.pageX - containerRef.current.offsetLeft;
      const walk = x - containerRef.current.startX;
      containerRef.current.scrollLeft = containerRef.current.scrollLeftStart - walk;
    }
  };

  const handleMouseUp = () => {
    if (containerRef.current) {
      containerRef.current.isDragging = false;
      containerRef.current.style.scrollSnapType = "x mandatory";
    }
  };

  return (
    <div className="card-slider-container">
      {scrollPosition > 0 && (
        <button className="scroll-btn left" onClick={() => handleScroll("left")}>‹</button>
      )}

      <div
        className="card-slider"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}
      >
        {cards.map((card, index) => (
          <Card key={index} imageUrl={card.imageUrl} title={card.title} price={card.price} />
        ))}
      </div>

      {containerRef.current && scrollPosition < containerRef.current.scrollWidth - containerRef.current.clientWidth && (
        <button className="scroll-btn right" onClick={() => handleScroll("right")}>›</button>
      )}
    </div>
  );
};

export default CardContainer;
