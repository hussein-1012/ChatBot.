import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import AuthPage from "./Pages/authPage";
import ChatPage from "./Pages/ChatPage";
import AboutPage from "./Pages/AboutPage";
import OurServicePage from "./Pages/OurServicePage";
import PortfolioPage from "./Pages/PortfolioPage";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/chats" element={<ChatPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<OurServicePage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
      </Routes>
    </div>
  );
};

export default App;
