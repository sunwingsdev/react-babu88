import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { useToasts } from "react-toast-notifications";
import { useEffect } from "react";

const AdminRoute = ({ children }) => {
  const { token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  // const { addToast } = useToasts();

  useEffect(() => {
    if (!token || !user || user?.role !== "admin") {
      // addToast("Please first login as an admin", {
      //   appearance: "error",
      //   autoDismiss: true,
      // });
      navigate("/admin");
    }
  }, [token, user, navigate]);

  if (!token || !user || user?.role !== "admin") {
    return null;
  }

  return children;
};

export default AdminRoute;
