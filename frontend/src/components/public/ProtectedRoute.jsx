/* eslint-disable react/prop-types */
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ allowedRoles }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setRole(parsedUser.roleType); // Get the user's role
    }
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>; // Prevents flickering issues

  return allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
