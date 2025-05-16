import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
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

  // Form state
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

  useEffect(() => {
    let itemsArray: string[] = [];

    if (typeof headerData.items === "string") {
      itemsArray = headerData.items.split(",").map((i) => i.trim());
    } else if (Array.isArray(headerData.items)) {
      itemsArray = headerData.items;
    }

    setHeaderSettings({
      color: headerData.color || "#343a40",
      logo: headerData.image || "/default-logo.png",
      alt: headerData.name || "logo",
      item: itemsArray,
    });
  }, [headerData]);

  return (
    <header>
      <Navbar
        expand="lg"
        collapseOnSelect
        style={{ backgroundColor: headerSettings.color }}
        variant="dark"
        className="h-20"
      >
        <Container>
          <Link href="/" passHref legacyBehavior>
            <Navbar.Brand>
              {headerSettings.logo.match(/\.(jpeg|jpg|gif|png|svg|webp)$/i) && !imageError ? (
                <img
                  src={headerSettings.logo}
                  alt={headerSettings.alt}
                  width={90}
                  height={40}
                  style={{ objectFit: "contain", display: "block" }}
                  className="mt-3"
                  onError={() => setImageError(true)}
                />
              ) : (
                <span style={{ color: "#fff", fontWeight: "bold" }}>
                  {headerSettings.alt}
                </span>
              )}
            </Navbar.Brand>
          </Link>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <SearchBox />
            <Nav className="ms-auto">


              {/* Categories */}
            <NavDropdown title="Categories" id="categories-menu">
              {headerSettings.item.map((item, index) => (
                <Link key={index} href={`/${item.toLowerCase()}`} passHref legacyBehavior>
                  <NavDropdown.Item>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                  </NavDropdown.Item>
                </Link>
              ))}
            </NavDropdown>

          
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
              
              <Link href="/cart" passHref legacyBehavior>
                <Nav.Link className="mr-3">
                  <i className="fas fa-shopping-cart"></i> Cart
                </Nav.Link>
              </Link>

              {data ? (
                <NavDropdown title={data.name} id="username">
                  <Link href="/profile" passHref legacyBehavior>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </Link>
                  <NavDropdown.Item onClick={() => logout()}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Link href="/login" passHref legacyBehavior>
                  <Nav.Link>
                    <i className="fas fa-user"></i> Sign In
                  </Nav.Link>
                </Link>
              )}

              {data && data.isAdmin && (
                <NavDropdown title="Admin" id="admin-menu">
                  <Link href="/admin/users" passHref legacyBehavior>
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </Link>
                  <Link href="/admin/products" passHref legacyBehavior>
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </Link>
                  <Link href="/admin/orders" passHref legacyBehavior>
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </Link>
                  <Link href="/admin/updateHeader" passHref legacyBehavior>
                    <NavDropdown.Item>Update Header</NavDropdown.Item>
                  </Link>
                  <Link href="/admin/updateSlider" passHref legacyBehavior>
                    <NavDropdown.Item>Update Slider</NavDropdown.Item>
                  </Link>
                  <Link href="/admin/updateFooter" passHref legacyBehavior>
                    <NavDropdown.Item>Update Footer</NavDropdown.Item>
                  </Link>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
