import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useState } from "react";
import { publicRequest } from "../requestMethod";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await publicRequest.post("auth/login", { email, password });
      console.log("login response", res);
      // save token and user info
      if (res?.data?.accessToken) {
        localStorage.setItem("accessToken", res.data.accessToken);
      }
      // navigate to dashboard
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      setError(err?.response?.data || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="h-[80vh] flex items-center justify-evenly p-[50px] text-gray-300">
        <div>
          <h2 className="text-[#D9D9D9] font-semibold text-[35px]">
            Swift_Delivery Admin
          </h2>
          <img src="/hero.png" alt="" />
        </div>
        <form
          onSubmit={handleSubmit}
          className="h-[450px] w-[450px] bg-[#E9EB77] rounded-md flex flex-col items-center justify-center"
        >
          {error && <div className="text-red-600 mb-2">{String(error)}</div>}
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            className="bg-[#fff] p-[12px] w-[350px] mb-4 outline-none"
            placeholder="Enter your email"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="bg-[#fff] p-[12px] w-[350px] mb-4 outline-none"
            placeholder="Enter your password"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-[#1E1E1E] w-[350px] p-[12px] text-white font-semibold text-[18px]"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
