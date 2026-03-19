import { Routes, Route } from "react-router-dom";
import App from "../App";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
    </Routes>
  );
};
