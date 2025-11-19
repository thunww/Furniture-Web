import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../../redux/authSlice";
import { fetchUserById } from "../../../../redux/adminSlice";
import Search from "../Search/Search";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";

import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegHeart, FaUser } from "react-icons/fa";
import { MdNotificationsNone } from "react-icons/md";

import {
  FaSignOutAlt,
  FaShoppingBag,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

import Tooltip from "@mui/material/Tooltip";
import Navigation from "./Navigation";
import MyContext from "../../../../context/MyContext";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const Header = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const authUser = useSelector((state) => state.auth.user);
  const user = useSelector((state) => state.admin.selectedUser);
  const userId = authUser?.user_id;

  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems?.reduce((t, i) => t + i.quantity, 0) || 0;

  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (userId && !user) dispatch(fetchUserById(userId));
  }, [userId, user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowAccountMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="relative">
      {/* ========= TOP STRIP (COLOR = FOOTER) ========= */}
      <div className="bg-[#3B393A] py-2">
        <div className="container px-4">
          <div className="flex items-center justify-between">
            <p className="text-white text-[11px] sm:text-[12px] font-medium truncate">
              Get up to 50% off new season styles, limited time only.
            </p>

            <ul className="hidden sm:flex items-center gap-4">
              <li>
                <Link
                  to="/help-center"
                  className="text-white text-[12px] hover:text-gray-200 transition"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/order-tracking"
                  className="text-white text-[12px] hover:text-gray-200 transition"
                >
                  Order Tracking
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ========= MAIN HEADER ========= */}
      <div className="bg-white py-3 border-b border-gray-200">
        <div className="container px-4 flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="block">
            <img
              src="/logo.jpg"
              alt="logo"
              className="max-h-10 sm:max-h-12 w-auto"
            />
          </Link>

          <div className="w-full sm:flex-1 order-3 sm:order-2">
            <Search />
          </div>

          <div className="flex items-center gap-3 order-2 sm:order-3">
            <ul className="flex items-center gap-4">
              <li>
                <Tooltip title="Cart">
                  <IconButton onClick={() => navigate("/cart")}>
                    <StyledBadge badgeContent={cartCount} color="secondary">
                      <MdOutlineShoppingCart className="text-black text-lg" />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
              </li>

              <li>
                <Tooltip title="Wishlist">
                  <IconButton>
                    <FaRegHeart className="text-black text-lg" />
                  </IconButton>
                </Tooltip>
              </li>

              <li>
                <Tooltip title="Notification">
                  <IconButton>
                    <StyledBadge badgeContent={10} color="secondary">
                      <MdNotificationsNone className="text-black text-lg" />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
              </li>

              {isAuthenticated ? (
                <li className="list-none relative" ref={menuRef}>
                  <button
                    onClick={() => setShowAccountMenu(!showAccountMenu)}
                    className="flex items-center gap-2 text-black text-sm font-[500]"
                  >
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-300">
                      <img
                        src={
                          user?.profile_picture ||
                          "https://th.bing.com/th/id/OIP.ByNwhzY5vUBvdIEfMCqDogHaHa"
                        }
                        className="w-full h-full object-cover"
                      />
                    </div>
                    My Account
                    {showAccountMenu ? (
                      <FaChevronUp className="text-xs" />
                    ) : (
                      <FaChevronDown className="text-xs" />
                    )}
                  </button>

                  {showAccountMenu && (
                    <div className="absolute right-0 mt-2 w-[220px] bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      <div className="py-3 px-4 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-800">
                          {user?.first_name} {user?.last_name}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>

                      <ul>
                        <li>
                          <Link
                            to="/my-account"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <FaUser className="text-blue-500" /> My Profile
                          </Link>
                        </li>

                        <li>
                          <Link
                            to="/my-account/orders"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <FaShoppingBag className="text-blue-500" /> My
                            Orders
                          </Link>
                        </li>

                        <li className="border-t border-gray-100 mt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                          >
                            <FaSignOutAlt /> Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </li>
              ) : (
                <li>
                  <Link
                    to="/login"
                    className="flex items-center gap-1 text-black text-[14px] font-[500] hover:text-gray-700 transition"
                  >
                    <FaUser className="text-[15px]" />
                    <span>Login</span>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <Navigation />
    </header>
  );
};

export default Header;
