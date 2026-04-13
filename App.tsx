import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "./context/AuthContext";

import PublicLayout from "./layouts/PublicLayout";
import Home from "./components/Home";
import AdminLayout from "./layouts/AdminLayout";
import Login from "./pages/admin/Login";
import ResetPassword from "./pages/admin/ResetPassword";
import Dashboard from "./pages/admin/Dashboard";
import CmsPortfolio from "./pages/admin/CmsPortfolio";
import CmsPackages from "./pages/admin/CmsPackages";
import CmsReviews from "./pages/admin/CmsReviews";
import PrivateRoute from "./components/PrivateRoute";
import SEO from "./components/SEO";
import TestConnection from "./pages/TestConnection";
import CustomCursor from "./components/CustomCursor";
import CustomContextMenu from "./components/CustomContextMenu";
import ServiceDetail from "./components/ServiceDetail";
import DronePhotography from "./pages/DronePhotography";
import PortfolioGallery from "./pages/PortfolioGallery";

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <CustomCursor />
          <CustomContextMenu />
          <SEO />
          <Routes>
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
            </Route>

            <Route path="/admin" element={<AdminLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="reset-password" element={<ResetPassword />} />
              <Route element={<PrivateRoute />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="cms/portfolio" element={<CmsPortfolio />} />
                <Route path="cms/packages" element={<CmsPackages />} />
                <Route path="cms/reviews" element={<CmsReviews />} />
              </Route>
            </Route>

            <Route path="/test-connection" element={<TestConnection />} />
            <Route path="/service/:id" element={<ServiceDetail />} />
            <Route path="/drone-videography" element={<DronePhotography />} />
            <Route path="/portfolio/:category" element={<PortfolioGallery />} />
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;