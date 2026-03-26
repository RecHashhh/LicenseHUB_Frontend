import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardPage from "../pages/DashboardPage";
import EnterprisesPage from "../pages/EnterprisesPage";
import InfoPage from "../pages/InfoPage";
import LicensesPage from "../pages/LicensesPage";
import LoginPage from "../pages/LoginPage";
import ReportsPage from "../pages/ReportsPage";
import RequestsPage from "../pages/RequestsPage";
import SoftwarePage from "../pages/SoftwarePage";

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Layout>
            <DashboardPage />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/licenses"
      element={
        <ProtectedRoute>
          <Layout>
            <LicensesPage />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/requests"
      element={
        <ProtectedRoute>
          <Layout>
            <RequestsPage />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/reports"
      element={
        <ProtectedRoute>
          <Layout>
            <ReportsPage />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/info"
      element={
        <ProtectedRoute>
          <Layout>
            <InfoPage />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/enterprises"
      element={
        <ProtectedRoute requiredRole="admin">
          <Layout>
            <EnterprisesPage />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/software"
      element={
        <ProtectedRoute requiredRole="admin">
          <Layout>
            <SoftwarePage />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default AppRoutes;
