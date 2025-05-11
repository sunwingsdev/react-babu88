import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useToasts } from "react-toast-notifications";

const PrivateRoute = ({ children }) => {
  const { token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { addToast } = useToasts();

  useEffect(() => {
    if (!token || !user) {
      navigate("/login");
      addToast("Please login to access this page", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  }, [token, user, navigate, addToast]);

  if (!token || !user) {
    return null;
  }

  return children;
};

export default PrivateRoute;
