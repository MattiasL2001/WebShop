import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

export const useLogout = () => {
  const { setAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    setAuthenticated(false);
    localStorage.removeItem("jwtToken");
    if (location.pathname === '/mypage') {
      navigate('/home');
    }
  };

  return logout;
};
