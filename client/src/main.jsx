import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import Router from "./routes/Router.jsx";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./redux/store";
import { ToastProvider, useToasts } from "react-toast-notifications";

import { useEffect } from "react";
import { fetchThemeColors } from "./redux/slices/themeColorSlice";
import loadingImage from "./assets/loadingImage.gif";

const AppWrapper = () => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const { loading, error } = useSelector((state) => state.themeColor);

  useEffect(() => {
    dispatch(fetchThemeColors()).unwrap().catch((err) => {
      addToast(`Error: ${err}`, { appearance: "error", autoDismiss: true });
    });
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-200">
        <div className="text-center">
        
          <img src={loadingImage} alt="Loading" className="h-20 w-20 mx-auto mt-6" />
        </div>
      </div>
    );
  }

  return <RouterProvider router={Router} />;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <AppWrapper />
      </ToastProvider>
    </Provider>
  </StrictMode>
);