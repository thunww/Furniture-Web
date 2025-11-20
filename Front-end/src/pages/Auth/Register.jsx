import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register, resetMessage, loginWithGoogle } from "../../redux/authSlice";
import { ToastContainer, toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordHint, setShowPasswordHint] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { message, error, isLoading } = useSelector((state) => state.auth);

  // Kiểm tra mật khẩu mạnh: 8-64 ký tự, có hoa, thường, số, ký tự đặc biệt, không khoảng trắng
  const isStrongPassword = (pw) => {
    if (!pw) return false;
    const checks = {
      length: pw.length >= 8 && pw.length <= 64,
      lowercase: /[a-z]/.test(pw),
      uppercase: /[A-Z]/.test(pw),
      number: /\d/.test(pw),
      special: /[!@#$%^&*()\-_=+[{\]}\\|;:'",<.>/?`~]/.test(pw),
      noSpace: !/\s/.test(pw),
    };
    return Object.values(checks).every(Boolean);
  };

  const passwordChecks = {
    length: password.length >= 8 && password.length <= 64,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()\-_=+[{\]}\\|;:'",<.>/?`~]/.test(password),
    noSpace: !/\s/.test(password),
  };

  const allPasswordValid = Object.values(passwordChecks).every(Boolean);

  // Reset thông báo
  useEffect(() => {
    dispatch(resetMessage());
  }, [dispatch]);

  // Hiển thị toast
  useEffect(() => {
    if (message) {
      toast.success(message, {
        position: "top-right",
        autoClose: 2000,
        onClose: () => dispatch(resetMessage()),
      });
      setTimeout(() => navigate("/login"), 2000);
    }
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 3000,
        onClose: () => dispatch(resetMessage()),
      });
    }
  }, [message, error, navigate, dispatch]);

  // Submit đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin!", { position: "top-right" });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!", { position: "top-right" });
      return;
    }

    if (!isStrongPassword(password)) {
      setShowPasswordHint(true); // hiển thị checklist, không gửi request
      return;
    }

    await dispatch(register({ username, email, password }));
  };

  // 🟢 Google Sign Up
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await dispatch(loginWithGoogle(credentialResponse.credential)).unwrap();
      toast.success("Đăng ký / đăng nhập Google thành công!");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      toast.error(err || "Đăng ký Google thất bại");
    }
  };

  const handleGoogleError = () => {
    toast.error("Đăng ký Google thất bại");
  };

  return (
    <div className="flex justify-center items-center h-full p-8 bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="w-full max-w-6xl overflow-hidden rounded-3xl shadow-lg border border-gray-100 bg-white bg-opacity-90 backdrop-blur-md">
        <div className="flex flex-wrap">
          {/* Ảnh minh họa */}
          <div className="hidden md:block w-1/2 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="./login.png"
                alt="Register visual"
                className="h-full w-full object-contain hover:scale-102 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Form đăng ký */}
          <div className="w-full md:w-1/2 bg-white p-8 bg-gradient-to-br from-white to-blue-50">
            <div className="max-w-md mx-auto">
              <div className="flex items-center mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-full shadow-md">
                  <User className="text-white" size={24} />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 ml-3">
                  Register
                </h2>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Username */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    User Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
                    <input
                      type="text"
                      className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none bg-white shadow-sm"
                      placeholder="Enter your full name"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
                    <input
                      type="email"
                      className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none bg-white shadow-sm"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
                    <input
                      type="password"
                      className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none bg-white shadow-sm"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setShowPasswordHint(true);
                      }}
                      required
                    />
                  </div>
                  {showPasswordHint && (
                    <ul className="mt-2 text-sm space-y-1 text-gray-700">
                      <PasswordRule ok={passwordChecks.length} text="Dài 8-64 ký tự" />
                      <PasswordRule ok={passwordChecks.lowercase} text="Có chữ thường" />
                      <PasswordRule ok={passwordChecks.uppercase} text="Có chữ hoa" />
                      <PasswordRule ok={passwordChecks.number} text="Có số" />
                      <PasswordRule ok={passwordChecks.special} text="Có ký tự đặc biệt" />
                      <PasswordRule ok={passwordChecks.noSpace} text="Không có khoảng trắng" />
                    </ul>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
                    <input
                      type="password"
                      className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none bg-white shadow-sm"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Nút đăng ký */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 shadow-md"
                  disabled={
                    isLoading ||
                    !username.trim() ||
                    !email.trim() ||
                    !password.trim() ||
                    !confirmPassword.trim() ||
                    password !== confirmPassword ||
                    !allPasswordValid
                  }
                >
                  {isLoading ? "Đang đăng ký..." : "Register"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gradient-to-r from-white to-blue-50 text-gray-500">
                    Or continue with Google
                  </span>
                </div>
              </div>

              {/* Google Login */}
              <div className="flex justify-center mb-6">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  text="continue_with"
                  shape="rectangular"
                  size="large"
                  width="350"
                  locale="vi"
                />
              </div>

              <p className="text-center text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline transition duration-150"
                >
                  Login here
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

export default Register;

const PasswordRule = ({ ok, text }) => {
  return (
    <li className={`flex items-center ${ok ? "text-green-600" : "text-red-600"}`}>
      <span className="mr-2">{ok ? "✔" : "✖"}</span>
      {text}
    </li>
  );
};
