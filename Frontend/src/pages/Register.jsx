import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { publicRequest } from "../requestMethods";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Register = () => {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    age: "",
    country: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.email || !form.password || !form.fullname) {
      setError("Please fill fullname, email and password.");
      return;
    }
    try {
      setLoading(true);
      const res = await publicRequest.post("/auth/register", form);
      setLoading(false);
      // on success, navigate to login
      navigate("/login");
    } catch (err) {
      setLoading(false);
      setError(err?.response?.data || err.message || "Registration failed");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="h-[80vh] flex items-center justify-center p-[50px] text-gray-300">
        <form
          onSubmit={handleSubmit}
          className="bg-[#e9eb77] p-8 rounded-md w-[420px]"
        >
          <h2 className="text-2xl font-semibold mb-4 text-black">Create account</h2>

          <input
            name="fullname"
            placeholder="Full name"
            value={form.fullname}
            onChange={handleChange}
            className="block w-full p-3 mb-3 outline text-black"
          />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="block w-full p-3 mb-3 outline text-black"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="block w-full p-3 mb-3 outline text-black"
          />
          <input
            name="age"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
            className="block w-full p-3 mb-3 outline text-black"
          />
          <input
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
            className="block w-full p-3 mb-3 outline text-black"
          />
          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="block w-full p-3 mb-3 outline text-black"
          />

          {error && <div className="text-red-600 mb-2">{String(error)}</div>}

          <button
            type="submit"
            className="bg-[#1e1e1e] text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
