import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "./components/organisms/Layout";
import CompaniesPage from "./pages/CompaniesPage";

import ContractorsPage from "./pages/ContractorsPage";
import ClientsPage from "./pages/ClientsPage";
import CompanyPage from "./pages/CompanyPage";
import SearchPage from "./pages/SearchPage";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="companies" element={<CompaniesPage />} />
          <Route path="/companies/:id" element={<CompanyPage />} />
          <Route path="contractors" element={<ContractorsPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="search" element={<SearchPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/companies" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
