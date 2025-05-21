import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const UserRoute = () => {
  const localKey = localStorage.getItem("sb-ggigrakpmocwmzfyrzdi-auth-token");

  const location = useLocation();

  return localKey ? (

    <Navigate to="/" state={{ from: location }} replace/>
  ) : (
    <Outlet />
  );
};

export default UserRoute;
