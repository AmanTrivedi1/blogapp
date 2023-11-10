import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { BsPencilFill } from "react-icons/bs";
import logo from "../imgs/logo.png";
const Navbar = () => {
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
  return (
    <>
      <nav className="navbar background ">
        <Link className="flex-none w-10 font-bold text-xl  " herf="/">
          <img src={logo} alt="Icon" className="w-full" />
        </Link>
        {searchBoxVisibility ? (
          <div
            className="absolute background  w-full left-0 top-full mt-0.5  py-4 px-[5vw]  md:block md:relative
                md:inset-0 md:p-0 md:w-auto "
          >
            <input
              type="text"
              placeholder="Search..."
              className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full      
                   placeholder:text-dark-grey md:pl-12  "
            />
            <AiOutlineSearch className="absolute w-5 h-5 md:left-5 right-[10%] text-dark-grey  -translate-y-1/2 md:pointer-events-none top-1/2 " />
          </div>
        ) : (
          <></>
        )}

        <div className="flex items-center  gap-3 md:gap-6 ml-auto ">
          <button
            onClick={() => setSearchBoxVisibility((currentVal) => !currentVal)}
            className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center "
          >
            <AiOutlineSearch className="text-xl" />
          </button>
          <Link to="/editor" className="hidden items-center md:flex gap-2 link">
            <BsPencilFill />
            <p>Write</p>
          </Link>
          <Link className="btn-dark py-2  " to="/signin">
            Sign in
          </Link>
          <Link className="btn-light py-2 hidden md:block " to="/signup">
            Sign up
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
