import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Logo from "../assets/realtor-logo.png";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-2">
        <Link className="flex items-center gap-3" to="/">
          <img src={Logo} alt="logo" className="w-8" />
          <h1 className="font-bold text-sm sm:text-lg flex">
            <span className="text-slate-500">ready</span>
            <span className="text-slate-700">homes</span>
          </h1>
        </Link>
        <form className="bg-slate-100 p-2 rounded-lg flex items-center">
          <input
            type="text"
            name="headerSearch"
            id="headerSearch"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <FaSearch className="text-slate-600" />
        </form>
        <ul className="flex gap-4 ">
          <Link to="/">
            <li className="cursor-pointer hidden sm:inline text-slate-700 hover:font-medium">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="cursor-pointer hidden sm:inline text-slate-700 hover:font-medium">
              About
            </li>
          </Link>
          {currentUser ? (
            <Link to="/profile">
              <img
                className="rounded-md h-7 w-7 object-cover"
                src={currentUser.profileImg}
                alt="user img"
              ></img>
            </Link>
          ) : (
            <Link to="/sign-in">
              <li className="cursor-pointer text-slate-700 hover:font-medium">
                Sing In
              </li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
}
