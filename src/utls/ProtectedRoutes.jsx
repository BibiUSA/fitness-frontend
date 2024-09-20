import { Outlet, Navigate } from "react-router-dom";

export default function ProtectedRoutes() {
  const user = null;
  return user ? <Outlet /> : <Navigate to="/account" />;
}
