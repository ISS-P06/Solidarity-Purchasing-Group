import { Navbar as BNavbar, Dropdown } from 'react-bootstrap';
import { BsBasket2, BsPersonCircle } from 'react-icons/bs';
import { BiUser, BiLogIn, BiLogOut } from 'react-icons/bi';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { Link } from 'react-router-dom';

import { getUserRoute } from '../utils';

function Navbar(props) {
  const userRole = props.userRole;

  return (
    <BNavbar collapseOnSelect className="navbar text-light" fixed="top" fluid="true" expand="lg">
      <BNavbar.Brand as={Link} to={getUserRoute(userRole)} style={{ color: '#fff' }}>
        <BsBasket2 size={30} /> SPG
      </BNavbar.Brand>

      <BNavbar.Collapse
        id="responsive-navbar-nav"
        className="justify-content-end"></BNavbar.Collapse>

      <SettingsDropdown {...props} />
    </BNavbar>
  );
}

function SettingsDropdown(props) {
  const { loggedIn, doLogout } = props;

  /**
   * Visible only if the user is **not** logged in.
   */
  const NotLoggedLinks = () => (
    <>
      <Dropdown.Item as={Link} to="/login">
        <BiLogIn size={25} />
        Login
      </Dropdown.Item>
      <Dropdown.Item as={Link} to="/register">
        <AiOutlineUserAdd size={25} />
        Sign-Up
      </Dropdown.Item>
    </>
  );

  /**
   * Visible only when the user **is** logged in.
   */
  const LoggedLinks = () => (
    <>
      <Dropdown.Item as={Link} to={getUserRoute(props.userRole)}>
        <BiUser size={25} />
        Personal area
      </Dropdown.Item>
      <Dropdown.Item onClick={doLogout}>
        <BiLogOut size={25} />
        Logout
      </Dropdown.Item>
    </>
  );

  return (
    <Dropdown drop="start" className="settings-dd">
      <Dropdown.Toggle variant="success" data-testid="settings-dd">
        <BsPersonCircle size={20} className="my-1" />
      </Dropdown.Toggle>

      <Dropdown.Menu>{!loggedIn ? <NotLoggedLinks /> : <LoggedLinks />}</Dropdown.Menu>
    </Dropdown>
  );
}

export default Navbar;
