import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Setoran from "../pages/Setoran";
import DetailMahasiswa from "../pages/MahasiswaDetail";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";

import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layout/MainLayout";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔓 PUBLIC ROUTE */}
        <Route path="/login" element={<Login />} />

        {/* 🔐 PROTECTED ROUTE */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* ✅ DEFAULT REDIRECT */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* ✅ MAIN ROUTES */}
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/setoran">
              <Route index element={<Setoran />} />
              <Route path=":nim" element={<DetailMahasiswa />} />
            </Route>
          </Route>
        </Route>

        {/* ❗ FALLBACK (ANTI ERROR URL) */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
