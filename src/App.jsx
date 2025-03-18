import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "aos/dist/aos.css";
import AOS from "aos";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import Login from "./pages/user/login";

function App() {
 

  return <>
    <Router>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
  </>;
}

export default App;
