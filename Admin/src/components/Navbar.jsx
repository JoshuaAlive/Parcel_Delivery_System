import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex items-center bg-[#E9EB77] justify-between h-[70px]">
      <img
        src="/logo.png"
        alt=""
         height={100}
        width={100}
        className="text-white"
      />

      <Link to="/login">
      <span className="mr-[20px] text-[18px] cursor-pointer">Logout</span>
      </Link>
    </div>
  );
};

export default Navbar;

