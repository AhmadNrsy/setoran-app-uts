import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // Penting yah, jangan lupa Outlet untuk render child route
};

export default ProtectedRoute;
