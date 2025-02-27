import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { useTypedSelector, useUserActions } from "../../hooks";
import SearchBox from "../SearchBox";
import { useDispatch } from "react-redux";
import { fetchHeader } from "../../state/Header/header.action-creators";

const Header = () => {
  const dispatch = useDispatch();

  // Redux state for header data
  const { loading, error, headerdata } = useTypedSelector((state) => ({
    loading: state.header?.loading || false,
    error: state.header?.error || null,
    headerdata: state.header?.data || [],
  }));

  // Ensure `header` is correctly extracted from `headerdata`
  const header = headerdata.length > 0 ? headerdata[0] : null;
  console.log("Header Data (in Header component):", headerdata);

  // Form state
  const [headerData, setHeaderData] = useState({
    name: "Sample name",
    color: "#000000", // Default black color
    image: "",
  });

  // Fetch header data when component mounts
  useEffect(() => {
    if (!headerdata.length) {
      dispatch(fetchHeader());
    }
  }, [dispatch, headerdata.length]); // Avoid unnecessary re-fetching

  // Update form state when Redux data is loaded
  useEffect(() => {
    if (header) {
      setHeaderData({
        name: header.name || "Sample name",
        color: header.color || "#000000",
        image: header.image || "",
      });
    }
  }, [header]);

  const { data } = useTypedSelector((state) => state.user);
  const { logout } = useUserActions();

  // State to hold header settings (color & logo)
  const [headerSettings, setHeaderSettings] = useState({
    color: "#343a40", // Default dark theme
    logo: "/default-logo.png",
    alt: "logo",
  });

  // Track image error state
  const [imageError, setImageError] = useState(false);

  // Update header settings when `headerData` changes
  useEffect(() => {
    setHeaderSettings({
      color: headerData.color || "#343a40",
      logo: headerData.image || "/default-logo.png",
      alt: headerData.name || "logo",
    });
  }, [headerData]);

  return (
    <header>
      <Navbar
        expand="lg"
        collapseOnSelect
        style={{ backgroundColor: headerSettings.color }} // Apply dynamic color
        variant="dark"
      >
        <Container>
          <Link href="/" passHref legacyBehavior>
            <Navbar.Brand>
              {headerSettings.logo.match(/\.(jpeg|jpg|gif|png|svg|webp)$/i) ? (
                <img
                  src={headerSettings.logo}
                  alt={headerSettings.alt}
                  width={150}
                  height={100}
                  style={{ objectFit: "contain", display: "block" }}
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
              <Link href="/cart" passHref legacyBehavior>
                <Nav.Link>
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
