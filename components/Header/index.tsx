"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTypedSelector, useUserActions } from "../../hooks";
import SearchBox from "../SearchBox";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { fetchHeader } from "../../state/Header/header.action-creators";

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
        className="h-20 flex items-center justify-between px-5 lg:px-8 text-gray-500 font-sans font-normal"
      >
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            {headerSettings.logo.match(/\.(jpeg|jpg|gif|png|svg|webp)$/i) && !imageError ? (
              <img
                src={headerSettings.logo}
                alt={headerSettings.alt}
                width={90}
                height={40}
                className="object-contain mt-3 mr-8"
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
            className="text-white focus:outline-none"
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
            isMenuOpen ? "block" : "hidden"
          } absolute lg:static top-20 left-0 w-full lg:w-auto bg-[${headerSettings.color}] lg:bg TypedPropertyDescriptor-transparent p-4 lg:p-0 transition-all duration-300 z-50`}
        >
          

          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="text-white hover:text-gray-300 focus:outline-none flex items-center"
              >
                CATEGORIES
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`absolute left-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg transition-opacity duration-200 z-20 ${
                  isCategoriesOpen ? "opacity-100 block" : "opacity-0 hidden"
                }`}
              >
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

            <Link href="/cart" className="text-white hover:text-gray-300 flex items-center">
              <i className="fas fa-shopping-cart mr-2"></i> CART
            </Link>

            {data ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserOpen(!isUserOpen)}
                  className="text-white hover:text-gray-300 focus:outline-none flex items-center"
                >
                  {data.name}
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`absolute left-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg transition-opacity duration-200 z-20 ${
                    isUserOpen ? "opacity-100 block" : "opacity-0 hidden"
                  }`}
                >
                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsUserOpen(false)}
                  >
                    PROFILE
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsUserOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    LOGOUT
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="text-white hover:text-gray-300 flex items-center">
                <i className="fas fa-user mr-2"></i> SIGN IN
              </Link>
            )}

            {data && data.isAdmin && (
              <div className="relative">
                <button
                  onClick={() => setIsAdminOpen(!isAdminOpen)}
                  className="text-white hover:text-gray-300 focus:outline-none flex items-center"
                >
                  ADMIN
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`absolute left-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg transition-opacity duration-200 z-20 ${
                    isAdminOpen ? "opacity-100 block" : "opacity-0 hidden"
                  }`}
                >
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
                    Update Footer
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