import { StrictMode, useEffect, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import Router from "./routes/Router.jsx";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./redux/store";
import { ToastProvider, useToasts } from "react-toast-notifications";
import { fetchThemeColors } from "./redux/slices/themeColorSlice";
import { useGetHomeControlsQuery } from "./redux/features/allApis/homeControlApi/homeControlApi";

const AppWrapper = () => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const { loading: themeLoading } = useSelector((state) => state.themeColor);
  const { data: homeControls } = useGetHomeControlsQuery();
  const [loadingImageUrl, setLoadingImageUrl] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const loadingTimer = useRef(null);
  const imageLoadTime = useRef(null);

  const loadingImageControl = homeControls?.find(
    (control) => control.category === "loading-image" && control.isSelected
  );

  useEffect(() => {
    if (loadingImageControl?.image) {
      const imageUrl = `${import.meta.env.VITE_BASE_API_URL}${
        loadingImageControl.image
      }`;
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        setLoadingImageUrl(imageUrl);
        imageLoadTime.current = Date.now();
        loadingTimer.current = setTimeout(() => {
          setShowContent(true);
        }, 2000);
      };
      img.onerror = () => {
        loadingTimer.current = setTimeout(() => {
          setShowContent(true);
        }, 2000);
      };
    } else {
      loadingTimer.current = setTimeout(() => {
        setShowContent(true);
      }, 2000);
    }

    return () => {
      if (loadingTimer.current) clearTimeout(loadingTimer.current);
    };
  }, [loadingImageControl]);

  useEffect(() => {
    dispatch(fetchThemeColors()).unwrap();
  }, [dispatch, addToast]);

  if (showContent && !themeLoading) {
    return <RouterProvider router={Router} />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      {loadingImageUrl && (
        <div className="text-center">
          <img
            src={loadingImageUrl}
            alt="Loading"
            className="w-40 mx-auto mt-6"
          />
        </div>
      )}
    </div>
  );
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
