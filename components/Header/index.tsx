//importing components
import Link from 'next/link';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
//import Image from 'next/image';
import { useTypedSelector, useUserActions } from '../../hooks';
import SearchBox from '../SearchBox';

const Header = () => {
  const { data } = useTypedSelector(state => state.user);
  const { logout } = useUserActions();

  return (
    <header>
  <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
    <Container>
      <Link href="/" passHref legacyBehavior>
        <Navbar.Brand>
          {/*<Image src="/logoC.png" alt="logo" width={200} height={80} priority />*/}Sellaro
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
              <Link href = "/admin/pages" passHref legacyBehavior>
                <NavDropdown.Item>Update Header</NavDropdown.Item>
              </Link>
              <Link href = "/admin/updateSlider" passHref legacyBehavior>
                <NavDropdown.Item>Updatet Slider</NavDropdown.Item>
              </Link>
              <Link href = "/admin/updateFooter" passHref legacyBehavior>
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
