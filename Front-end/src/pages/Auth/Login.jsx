import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Shield, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { GoogleLogin } from "@react-oauth/google";
import { ToastContainer, toast } from "react-toastify";
import { login, loginWithGoogle, resetMessage } from "../../redux/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isExecutingCaptcha, setIsExecutingCaptcha] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const { message, error, isLoading, needCaptcha, isLocked, attempts } =
    useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(resetMessage());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message, {
        position: "top-right",
        autoClose: 2000,
        onClose: () => dispatch(resetMessage()),
      });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 3000,
        onClose: () => dispatch(resetMessage()),
      });
    }
  }, [message, error, navigate, dispatch]);

  // 🟢 Handle Email/Password Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Vui lòng nhập đầy đủ thông tin!", { position: "top-right" });
      return;
    }

    let captchaToken = null;

    if (needCaptcha || attempts >= 3) {
      if (!executeRecaptcha) {
        toast.error("reCAPTCHA chưa sẵn sàng. Vui lòng thử lại.");
        return;
      }

      try {
        setIsExecutingCaptcha(true);
        captchaToken = await executeRecaptcha("login");
      } catch (error) {
        console.error("CAPTCHA execution error:", error);
        toast.error("Không thể xác minh CAPTCHA. Vui lòng thử lại.");
        setIsExecutingCaptcha(false);
        return;
      } finally {
        setIsExecutingCaptcha(false);
      }
    }

    await dispatch(
      login({
        userData: { email, password, rememberMe },
        captchaToken,
      })
    );
  };

  // 🟢 Handle Google Login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await dispatch(loginWithGoogle(credentialResponse.credential)).unwrap();
      toast.success("Đăng nhập Google thành công!");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      toast.error(err || "Đăng nhập Google thất bại");
    }
  };

  const handleGoogleError = () => {
    toast.error("Đăng nhập Google thất bại");
  };

  return (
    <div className="flex justify-center items-center h-full p-8 bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="w-full max-w-6xl overflow-hidden rounded-3xl shadow-lg border border-gray-100 bg-white bg-opacity-90 backdrop-blur-md">
        <div className="flex flex-wrap">
          {/* Hình minh họa bên trái */}
          <div className="hidden md:block w-1/2 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="./login.png"
                alt="Login visual"
                className="h-full w-full object-contain hover:scale-102 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Form đăng nhập */}
          <div className="w-full md:w-1/2 bg-white p-8 bg-gradient-to-br from-white to-blue-50">
            <div className="max-w-md mx-auto">
              <div className="flex items-center mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-full shadow-md">
                  <Lock className="text-white" size={24} />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 ml-3">Login</h2>
              </div>

              {/* 🔴 Tài khoản bị khóa */}
              {isLocked && (
                <div className="mb-4 rounded-lg bg-red-50 p-4 border border-red-200">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Tài khoản tạm thời bị khóa
                      </h3>
                      <p className="mt-1 text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 🟡 Cảnh báo cần CAPTCHA */}
              {needCaptcha && !isLocked && (
                <div className="mb-4 rounded-lg bg-yellow-50 p-4 border border-yellow-200">
                  <div className="flex">
                    <Shield className="h-5 w-5 text-yellow-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Yêu cầu xác minh bảo mật
                      </h3>
                      <p className="mt-1 text-sm text-yellow-700">
                        Vui lòng hoàn thành xác minh CAPTCHA để tiếp tục.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form login */}
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none bg-white shadow-sm disabled:bg-gray-100"
                      placeholder="Enter your email"
                      disabled={isLoading || isLocked}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-gray-700 font-medium">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none bg-white shadow-sm disabled:bg-gray-100"
                      placeholder="Enter your password"
                      disabled={isLoading || isLocked}
                    />
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLocked}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:cursor-not-allowed"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || isExecutingCaptcha || isLocked}
                >
                  {isLoading || isExecutingCaptcha ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      {isExecutingCaptcha
                        ? "Đang xác minh..."
                        : "Đang đăng nhập..."}
                    </span>
                  ) : (
                    <>
                      Login
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </form>

              {/* reCAPTCHA notice */}
              {(needCaptcha || attempts >= 3) && !isLocked && (
                <div className="mt-4 text-xs text-center text-gray-500">
                  <p>
                    Trang này được bảo vệ bởi reCAPTCHA và tuân theo{" "}
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      Chính sách Bảo mật
                    </a>{" "}
                    và{" "}
                    <a
                      href="https://policies.google.com/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      Điều khoản Dịch vụ
                    </a>{" "}
                    của Google.
                  </p>
                </div>
              )}

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gradient-to-r from-white to-blue-50 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Login Button */}
              <div className="flex justify-center mb-6">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  text="continue_with"
                  shape="rectangular"
                  size="large"
                  width="350"
                  locale="vi"
                  disabled={isLocked}
                />
              </div>

              <p className="text-center text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline transition duration-150"
                >
                  Sign up now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
