import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Signup from "./auth/signup.jsx";
import Login from "./auth/login.jsx";
import { Provider } from "react-redux";
import store from "./globalState.jsx";
import { AllCommunityModule } from "ag-grid-community";
import { AgGridProvider } from "ag-grid-react";

const modules = [AllCommunityModule];

createRoot(document.getElementById("root")).render(
  <AgGridProvider modules={modules}>
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<App />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  </AgGridProvider>,
);
