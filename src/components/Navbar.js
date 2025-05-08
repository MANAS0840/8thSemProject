import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import logo from "../assets/logo.png";
import { Link, matchPath, useLocation } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";

const Logo = styled.img`
  width: 60px;
  display: inline-block;
  margin-right: 1rem;
`;

const MainHeading = styled.h1`
  font-size: 2rem;
  font-weight: 400;
  display: inline-block;
  color: #fff;
  //  margin-top: rem;

  span {
    font-weight: 700;
  }
`;
const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <nav className="bg-[#1e1e1e] text-[--ac-1]">
      <div className="lg:mx-64 md:mx-1 md:w-[400px] flex items-center justify-between ">
        <div className="logo flex gap-x-2 items-center p-2">
          <Link to="/">
            <MainHeading>
              <span>Code</span> Master
            </MainHeading>
          </Link>
        </div>
        <div className="nav-links">
          <ul className="flex items-center justify-between gap-x-4 font-medium">
            <li>
              {/* Login / Signup / Dashboard */}
              <div className="lg:items-center gap-x-4  flex absolute right-5 lg:top-3 lg:mr-0  md:mr-[98px]">
                {token === null && (
                  <Link to="/login">
                    <button className="rounded-[8px] lg:border lg:border-richblack-700 bg-richblack-800 lg:px-[12px] lg:py-[8px] text-white lg:font-bold md:px-4 relative lg:top-0 top-[-0.5rem]">
                      Log in
                    </button>
                  </Link>
                )}
                {token === null && (
                  <Link to="/signup">
                    <button className="rounded-[8px] lg:border lg:border-richblack-700 bg-richblack-800 lg:px-[12px] lg:py-[8px] text-white lg:font-bold relative lg:top-0 top-[-0.5rem] ">
                      Sign up
                    </button>
                  </Link>
                )}
                {token !== null && (
                  <Link to="/problems">
                    <button className="rounded-[8px]  bg-richblack-800 lg:px-[12px] lg:py-[8px] text-white lg:font-bold relative lg:top-0 top-[-0.5rem] ">
                      Problems
                    </button>
                  </Link>
                )}
                {token !== null && <ProfileDropdown />}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
