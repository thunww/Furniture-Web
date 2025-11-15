import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getProfile } from "./redux/authSlice";
import AppRoutes from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from "@react-oauth/google"; // ← THÊM

function App() {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  // 🧩 Khi reload hoặc mở lại app → tự động kiểm tra cookie và lấy lại user
  useEffect(() => {
    dispatch(getProfile()).finally(() => setIsInitialized(true));
  }, [dispatch]);

  // Hiển thị loading khi đang check auth lần đầu
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    // ← WRAP VỚI GoogleOAuthProvider
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} />
    </GoogleOAuthProvider>
  );
}

export default App;
