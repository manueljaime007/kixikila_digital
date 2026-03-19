import { useNavigate } from "react-router-dom";
import { Splash } from "../components/Splash";

export const SplashPage = () => {
  const navigate = useNavigate();
  return <Splash onComplete={() => navigate("/terms")} />;
};
