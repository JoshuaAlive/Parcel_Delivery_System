import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { login } from "../redux/apiCalls";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const error = useSelector((state) => state.user.error);

  const dispatch = useDispatch();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    if (email && password) {
      try {
        setLoading(true);
        await login(dispatch, { email, password });
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  };
  console.log(user?.currentUser);

  // redirect if already logged in
  if (user?.currentUser) return <Navigate to="/myparcels" />;
  return (
    <div>
      <Navbar />

      <div className="h-[80vh] flex items-center justify-evenly p-[50px] text-gray-300">
        <img src="/hero.png" alt="" />

        <div className="h-[450px] w-[450px] bg-[#e9eb77] rounded-md">
          <input
            type="text"
            name="email"
            id="email-input"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            className="flex items-center justify-center bg-[#fff] p-[20px] w-[350px] m-[10%] outline border-none"
          />

          <div className="flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password-input"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="flex items-center justify-center bg-[#fff] p-[20px] w-[350px] mt-[10%] ml-[10%] outline border-none"
            />

            <span
              style={{
                display: "inline",
                cursor: "pointer",
                fontSize: "20px",
              }}
              onClick={handleTogglePassword}
            >
              {showPassword ? "👁️" : "🔒"}
            </span>
          </div>

          <button
            className="bg-[#1e1e1e] w-[350px] p-[15px] text-white font-semibold text-[18px] m-[10%]"
            onClick={handleLogin}
          >
            {loading ? "Loading..." : "Login"}
            {user.currentUser && <Navigate to="/myparcels" />}
          </button>

          {error && (
            <span className="text-red-500">
              Please make sure that you have used correct email and password
            </span>
          )}

          <div className="text-center mt-3">
            <span className="text-sm text-black">
              Don't have an account?{" "}
            </span>
            <Link to="/register" className="text-sm text-blue-900 underline">
              Register
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
