import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../redux/userRedux";
import { persistor } from "../redux/store";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.currentUser);

  const handleLogout = async () => {
    try {
      dispatch(logOut());
      // clear persisted store so logged out state is persisted
      if (persistor && persistor.purge) await persistor.purge();
      try {
        // remove persisted key directly as a fallback
        localStorage.removeItem("persist:root");
      } catch (err) {
        // ignore
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
    navigate("/login");
    // ensure a fresh app state
    try {
      window.location.reload();
    } catch (err) {
      // ignore in non-browser envs
    }
  };

  return (
    <div className="h-[100px] bg-[#e9eb77] flex items-center justify-between px-10">
      <img src="/logo.png" alt="" height="150px" width="150px" />

      {user ? (
        <button
          onClick={handleLogout}
          className="bg-[#1e1e1e] p-[10px] text-gray-300 cursor-pointer border-none w-[100px]"
        >
          Logout
        </button>
      ) : (
        <Link to="/login">
          <button className="bg-[#1e1e1e] p-[10px] text-gray-300 cursor-pointer border-none w-[100px]">
            Login
          </button>
        </Link>
      )}
    </div>
  );
};

export default Navbar;
