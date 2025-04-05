import React, { useState, useRef, useEffect } from "react";
import Fuse from "fuse.js";
import categoriesData from "../../data/categories";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./search.css";

const slugify = (str) => {
  return str.toLowerCase().replace(/\s+/g, "-");
};

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();

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

    if (item.type === "item") {
      navigate(`/category/${slugify(item.category)}/${slugify(item.name)}`);
    } else if (item.type === "category") {
      navigate(`/category/${slugify(item.name)}`);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
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

    const results = fuse
      .search(" ")
      .map((res) => res.item)
      .slice(0, 10);
    setFilteredItems(results);
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
        if (query === "Listening now...") {
          setQuery("");
          return;
        }
        if (query.trim() !== "") {
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

          const results = fuse.search(query).map((res) => res.item);
          if (results.length > 0) {
            handleSelect(results[0]);
          } else {
            toast.error("No matching categories or items found.");
          }
        }
      };

      recognitionRef.current.onerror = () => {
        toast.error("Speech recognition error.");
        setIsListening(false);
        if (query === "Listening now...") setQuery("");
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
      };
    }
    recognitionRef.current.start();
  };

  const handleSearchClick = () => {
    if (query.trim() === "") {
      toast.error("Please enter a search query.");
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

    const results = fuse.search(query).map((res) => res.item);

    if (results.length > 0) {
      const selectedItem = results[0];
      if (selectedItem.type === "category") {
        navigate(`/category/${slugify(selectedItem.name)}`);
      } else if (selectedItem.type === "item") {
        navigate(
          `/category/${slugify(selectedItem.category)}/${slugify(
            selectedItem.name
          )}`
        );
      }
    } else {
      toast.error("No matching categories or items found.");
    }
  };

  return (
    <div className="search-container ">
      <div className="search-bar-wrapper">
        <input
          type="text"
          placeholder="Search categories or items..."
          value={query}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
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
              onMouseDown={() => setQuery(item.name)}
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
