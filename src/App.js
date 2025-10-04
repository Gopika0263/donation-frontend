import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import AppNavbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DonorDashboard from "./pages/DonorDashboard";
import ReceiverDashboard from "./pages/ReceiverDashboard";
import CreateDonationPage from "./pages/CreateDonationPage";
import NotFoundPage from "./pages/NotFoundPage";
// 🔹 Import Admin Dashboard page
import AdminDashboard from "./pages/AdminDashboard";

// 🔹 New imports
import About from "./pages/About";

import Features from "./pages/Features";

// Inside <Routes>

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppNavbar />
        <main className="container mt-4 mb-5">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/donor-dashboard"
              element={
                <PrivateRoute allowedRoles={["donor"]}>
                  <DonorDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/receiver-dashboard"
              element={
                <PrivateRoute allowedRoles={["receiver"]}>
                  <ReceiverDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-donation"
              element={
                <PrivateRoute allowedRoles={["donor"]}>
                  <CreateDonationPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            {/* 🔹 Newly added routes */}
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />;
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
       
      </AuthProvider>
    </Router>
  );
}

export default App;
