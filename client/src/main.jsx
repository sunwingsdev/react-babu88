import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import Router from "./routes/Router.jsx";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ToastProvider } from "react-toast-notifications";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <RouterProvider router={Router} />
      </ToastProvider>
    </Provider>
  </StrictMode>
);
