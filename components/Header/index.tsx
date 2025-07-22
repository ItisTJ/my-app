"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTypedSelector, useUserActions } from "../../hooks";
import SearchBox from "../SearchBox";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { fetchHeader } from "../../state/Header/header.action-creators";
import { FaShoppingCart, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import {  FaAngleDown, FaChessKing,   FaUser, FaUserAstronaut } from "react-icons/fa6";
import { FaTimes, FaSignInAlt } from "react-icons/fa";

const Header = () => {
  const dispatch = useAppDispatch();

  const { loading, error, headerdata } = useTypedSelector((state) => ({
    loading: state.header?.loading || false,
    error: state.header?.error || null,
    headerdata: state.header?.data || [],
  }));

  const header = headerdata.length > 0 ? headerdata[0] : null;

  const [headerData, setHeaderData] = useState<{
    name: string;
    color: string;
    image: string;
    items: string | string[];
  }>({
    name: "Sample name",
    color: "#000000",
    image: "",
    items: "",
  });

  useEffect(() => {
    if (!headerdata.length) {
      dispatch(fetchHeader());
    }
  }, [dispatch, headerdata.length]);

  useEffect(() => {
    if (header) {
      setHeaderData({
        name: header.name || "Sample name",
        color: header.color || "#000000",
        image: header.image || "",
        items: header.items || "",
      });
    }
  }, [header]);

  const { data } = useTypedSelector((state) => state.user);
  const { logout } = useUserActions();

  const [headerSettings, setHeaderSettings] = useState<{
    color: string;
    logo: string;
    alt: string;
    item: string[];
  }>({
    color: "#343a40",
    logo: "/default-logo.png",
    alt: "logo",
    item: [],
  });

  const [imageError, setImageError] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    let itemsArray: string[] = [];
    if (typeof headerData.items === "string") {
      itemsArray = headerData.items.split(",").map((i) => i.trim());
    } else if (Array.isArray(headerData.items)) {
      itemsArray = headerData.items;
    }
    console.log("itemsArray:", itemsArray); // Debug
    setHeaderSettings({
      color: headerData.color || "#343a40",
      logo: headerData.image || "/default-logo.png",
      alt: headerData.name || "logo",
      item: itemsArray,
    });
  }, [headerData]);

  return (
    <header>
      <nav
        style={{ backgroundColor: headerSettings.color }}
        className="h-20 flex items-center justify-between px-5 lg:px-8 text-gray-500 font-sans font-normal absolute top-0 left-0 right-0 z-50"
      >
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            {headerSettings.logo.match(/\.(jpeg|jpg|gif|png|svg|webp)$/i) && !imageError ? (
              <img
                src={headerSettings.logo}
                alt={headerSettings.alt}
                width={100}
                height={50}
                className="object-contain mt-2 mr-8"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="text-xl font-bold text-white">
                {headerSettings.alt}
              </span>
            )}
          </Link>
          <SearchBox />
        </div>

        <div className="lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none lg:hidden"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        <div
          className={`lg:flex lg:items-center lg:space-x-6 ${
            isMenuOpen ? "block bg-black" : "hidden"
          } absolute lg:static top-0 left-0 w-full lg:w-auto bg-[${headerSettings.color}] lg:bg TypedPropertyDescriptor-transparent p-4 lg:p-0 transition-all duration-300 z-50`}
        >
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}><FaTimes size={24}  className="lg:hidden text-white absolute top-4 right-4" /></button>
          
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="text-white hover:text-gray-300 focus:outline-none flex items-center group"
              >
                CATEGORIES
                <FaAngleDown size={20} color="white" className="group-hover:animate-bounce "/>
              </button>
              <div
                className={`fixed top-0 right-0 w-3/4 sm:w-64 lg:w-1/4 h-screen bg-opacity-50 bg-black backdrop-filter backdrop-blur text-white rounded-l-md shadow-lg z-20 transform transition-transform duration-300 ease-in-out  ${
                  isCategoriesOpen ? "opacity-100 block" : "opacity-0 hidden"
                }`}
              >
                <FaTimes size={24} className="absolute top-4 right-4 " onClick={() => setIsCategoriesOpen(false)} />
                  <div className="px-2 py-12">
                {headerSettings.item.map((item, index) => (
                  <Link
                    key={index}
                    href={`/${item.toLowerCase()}`}
                    className="block px-4 py-2 hover:bg-gray-100 capitalize"
                    onClick={() => setIsCategoriesOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
                </div>
              </div>
            </div>

            <Link href="/cart" className="text-white hover:text-gray-300 flex items-center">
              <FaShoppingCart size={20} />
            </Link>

            {data ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserOpen(!isUserOpen)}>
                  <FaUser size={20} color="white" className={`${data.isAdmin ? "hidden":"visible"}`}/>
                  <FaUserAstronaut size={20} color="magenta" className={`${data.isAdmin ? "visible":"hidden"} absolute top-0 right-0 animate-ping` }/>
                  <FaUserAstronaut size={20} color="white" className={`${data.isAdmin ? "visible":"hidden"}`}/>
                </button>
                 <div
                    className={`fixed top-0 right-0 w-fit sm:w-64 lg:w-1/4 h-screen bg-opacity-50 bg-black backdrop-filter backdrop-blur text-white rounded-l-md shadow-lg z-20 transform transition-transform duration-300 ease-in-out ${
                      isUserOpen ? 'translate-x-0' : 'translate-x-full'
                    } flex flex-col p-4`}
                  >
                  <FaTimes size={20} color="white" className="absolute top-4 right-4 cursor-pointer" onClick={() => setIsUserOpen(false)}/>
                  <p className=" font-sans text-white block px-4 py-0"> Hello</p>
                  <h1 className="font-bold text-2xl font-impact text-white block px-4 py-0 pb-2">{data.name} !</h1>
                  <p className=" font-sans text-xs text-[gold] block px-4 py-0">{data.isAdmin ? "(Admin User)" : ""}</p>
                  <hr className="my-2 border-gray-300" />
                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsUserOpen(false)}
                  >
                    <FaUserCircle size={20} className=" mr-2 inline" />
                    Profile 
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsUserOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-red-500 group"
                  >
                    <FaSignOutAlt size={20} className=" mr-2 inline group-hover:text-red-500" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="text-white hover:text-gray-300 flex items-center">
                <FaSignInAlt className="mr-2" size={20} /> SIGN IN
              </Link>
            )}

            {data && data.isAdmin && (
              <div className="relative">
                <button
                  onClick={() => setIsAdminOpen(!isAdminOpen)}
                  className="text-white hover:text-gray-300 focus:outline-none flex items-center"
                >
                  <FaChessKing size={20} color="gold" />
                </button>
                <div
                  className={`fixed top-0 right-0 w-3/4 sm:w-64 lg:w-1/4 h-screen bg-opacity-50 bg-black backdrop-filter backdrop-blur text-white rounded-l-md shadow-lg z-20 transform transition-transform duration-300 ease-in-out ${
                      isAdminOpen ? 'translate-x-0' : 'translate-x-full'
                    } flex flex-col p-4`}
                >
                   <FaTimes size={20} color="white" className="absolute top-4 right-4 cursor-pointer" onClick={() => setIsAdminOpen(!isAdminOpen)}/>
                  <Link
                    href="/admin/users"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsAdminOpen(false)}
                  >
                    Users
                  </Link>
                  <Link
                    href="/admin/products"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsAdminOpen(false)}
                  >
                    Products
                  </Link>
                  <Link
                    href="/admin/orders"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsAdminOpen(false)}
                  >
                    Orders
                  </Link>
                  <Link
                    href="/admin/updateHeader"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsAdminOpen(false)}
                  >
                    Update Header
                  </Link>
                  <Link
                    href="/admin/updateSlider"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsAdminOpen(false)}
                  >
                    Update Slider
                  </Link>
                  <Link
                    href="/admin/updateFooter"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsAdminOpen(false)}
                  >
                    Update Basic Details
                  </Link>
                  <Link
                    href="/admin/updateServices"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsAdminOpen(false)}
                  >
                    Update Services
                  </Link>
                  <Link
                    href="/admin/updatePrivacyPolicy"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsAdminOpen(false)}
                  >
                    Update Privacy & Policy
                  </Link>

                  <Link
                    href="/admin/updateBranches"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsAdminOpen(false)}
                  >
                    Update Branches
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;

   {/*make items array*/}
              {/*
              {headerSettings.item.map((item, index) => (
                <Link key={index} href={`/${item.toLowerCase()}`} passHref legacyBehavior>
                  <Nav.Link className="mr-3">
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Nav.Link>
                </Link>
              ))}
              */}


              {/*
              <Link href="/cart" passHref legacyBehavior>
                <Nav.Link className="mr-3">
                {headerSettings.item[2]}
                </Nav.Link>
              </Link>
              */}
              
              {/*Navbar Items
              <Link href="/services" passHref legacyBehavior>
                <Nav.Link className="mr-1">
                  Services
                </Nav.Link>
              </Link>

              <Link href="/about" passHref legacyBehavior>
                <Nav.Link className="mr-1">
                  About Us
                </Nav.Link>
              </Link>

              <Link href="/contact" passHref legacyBehavior>
                <Nav.Link className="mr-1">
                  Contact
                </Nav.Link>
              </Link>
              */}