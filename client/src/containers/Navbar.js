import { Navbar as BNavbar, Nav } from 'react-bootstrap';
import { BsBasket2 } from 'react-icons/bs';
import { Link } from 'react-router-dom';

import { getUserRoute } from '../utils';

function Navbar(props) {
  const loggedIn = props.loggedIn;
  const doLogout = props.doLogout;
  const userRole = props.userRole;

  const userPageText = (role) => {
    switch (role) {
      case 'shop_employee':
        return 'Employee page';
      default:
        return 'Home page';
    }
  };

  return (
    <BNavbar collapseOnSelect className="navbar text-light" fixed="top" fluid="true" expand="lg">
      <BNavbar.Toggle className="mr-auto" aria-controls="responsive-navbar-nav" />

      <BNavbar.Brand as={Link} to="/" style={{ color: '#fff' }}>
        <BsBasket2 size={30} /> Solidarity Purchasing Group
      </BNavbar.Brand>

      <BNavbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
        <Nav className="text-light">
          {loggedIn ? (
            <>
              <Nav.Link as={Link} to={getUserRoute(userRole)}>
                Home Page
              </Nav.Link>
              <Nav.Link onClick={doLogout}>Logout</Nav.Link>
            </>
          ) : (
            <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>
          )}
        </Nav>
      </BNavbar.Collapse>
    </BNavbar>
  );
}

export default Navbar;
