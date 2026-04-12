import React from "react";
import { FaBars } from "react-icons/fa";
import "./sidebar.css";

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="navbar navbar-light bg-light px-3">
      <button className="btn btn-outline" style={{color:'red'}} onClick={toggleSidebar}>
        <FaBars />
      </button>
      <span className="navbar-brand ms-3"></span>
    </nav>
  );
};

export default Navbar;

