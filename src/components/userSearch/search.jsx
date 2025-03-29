import React, { useState, useRef, useEffect } from "react";
import Fuse from "fuse.js";
import categoriesData from "../../data/categories";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./search.css";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const options = {
      includeScore: true,
      threshold: 0.4,
      keys: ["category", "items"],
    };

    const fuse = new Fuse(
      categoriesData.flatMap((cat) => [
        { type: "category", name: cat.category },
        ...cat.items.map((item) => ({
          type: "item",
          name: item,
          category: cat.category,
        })),
      ]),
      options
    );

    setFilteredItems(
      fuse
        .search(" ")
        .map((result) => result.item)
        .slice(0, 10)
    );
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);

    if (value === "") {
      setFilteredItems([]);
      return;
    }

    const fuse = new Fuse(
      categoriesData.flatMap((cat) => [
        { type: "category", name: cat.category },
        ...cat.items.map((item) => ({
          type: "item",
          name: item,
          category: cat.category,
        })),
      ]),
      { keys: ["name"], threshold: 0.3 }
    );

    const results = fuse.search(value).map((res) => res.item);
    setFilteredItems(results);
    setHighlightedIndex(-1);
  };

  const handleSelect = (item) => {
    setQuery(item.name);
    setSelectedItem(item);
    setFilteredItems([]);
  };

  const handleSearchClick = () => {
    if (filteredItems.length > 0) {
      handleSelect(filteredItems[0]);
    } else {
      toast.error("No matching categories or items found.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) =>
        prev < filteredItems.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      handleSelect(filteredItems[highlightedIndex]);
    }
  };

  useEffect(() => {
    if (highlightedIndex >= 0 && suggestionsRef.current) {
      const highlightedItem = suggestionsRef.current.children[highlightedIndex];
      if (highlightedItem) {
        highlightedItem.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIndex]);

  const startListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    if (!recognitionRef.current) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast.error("Your browser does not support speech recognition.");
        return;
      }
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setQuery("Listening now...");
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (query === "Listening now...") setQuery("");
      };

      recognitionRef.current.onerror = () => {
        toast.error("Speech recognition error.");
        setIsListening(false);
        if (query === "Listening now...") setQuery("");
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        handleSearch({ target: { value: transcript } });
      };
    }
    recognitionRef.current.start();
  };

  return (
    <div className="search-container">
      <div className="search-bar-wrapper">
        <input
          type="text"
          placeholder="Search categories or items..."
          value={query}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="search-input"
        />
        <div className="search-icons">
          <button
            onClick={startListening}
            className={`mic-button ${isListening ? "listening" : ""}`}
          >
            <i className={`bi ${isListening ? "bi-mic-fill" : "bi-mic"}`}></i>
          </button>
          <button onClick={handleSearchClick} className="search-button">
            <i className="bi bi-search"></i>
          </button>
        </div>
      </div>
      {isFocused && filteredItems.length > 0 && (
        <ul className="suggestions-list" ref={suggestionsRef}>
          {filteredItems.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelect(item)}
              className={highlightedIndex === index ? "highlighted" : ""}
            >
              {item.type === "category" ? (
                <strong>{item.name}</strong>
              ) : (
                <>
                  {item.name}{" "}
                  <span className="category-tag">({item.category})</span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      <ToastContainer />
    </div>
  );
};

export default SearchBar;
