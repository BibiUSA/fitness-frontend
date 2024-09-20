import { useState } from "react";
import React from "react";
import "./App.css";
import Navbar from "./components/Navbar.jsx";
import Create from "./pages/Create/Create.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Calendar from "./pages/Calendar/Calendar.jsx";
import Plans from "./pages/Plans/Plans.jsx";
import Account from "./pages/Account/Account.jsx";
import Settings from "./pages/Settings/Settings.jsx";
// import ProtectedRoutes from "./utls/ProtectedRoutes.jsx";

function App() {
  const [accountEmail, setAccountEmail] = useState(null);
  return (
    <div id="app">
      <BrowserRouter>
        <Routes>
          <Route path="/create/:plan" element={<Create />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/account" element={<Account />} />
          <Route path="/" element={<Calendar />} />
        </Routes>
        <Navbar />
      </BrowserRouter>
    </div>
  );
}

export default App;
