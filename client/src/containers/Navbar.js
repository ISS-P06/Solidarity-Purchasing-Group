import { Navbar as BNavbar, Dropdown, ButtonGroup, Button } from 'react-bootstrap';
import { BsBasket2, BsPersonCircle } from 'react-icons/bs';
import { BiUser, BiLogIn, BiLogOut } from 'react-icons/bi';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { BasketOffcanvas } from '.';
import { FaBars } from 'react-icons/fa';

import { getUserRoute } from '../utils';

function Navbar(props) {
  const {
    userRole,
    userId,
    virtualTime,
    openBasketOffCanvas,
    setOpenBasketOffCanvas,
    handleToggle,
  } = props;

  return (
    <BNavbar collapseOnSelect className="navbar text-light" fixed="top" fluid="true" expand="false">
      {/* This button shows up on mobile version for showing the sidebar */}
      {!userRole ? null : (
        <Button
          as={FaBars}
          className="btn aside-toggle"
          variant="success"
          onClick={() => handleToggle()}>
          <FaBars />
        </Button>
      )}

      <BNavbar.Brand as={Link} to={getUserRoute(userRole)} style={{ color: '#fff' }}>
        <BsBasket2 size={30} /> SPG
      </BNavbar.Brand>

      <ButtonGroup className="justify-content-end" xs={10}>
        <SettingsDropdown {...props} />

        {userRole === 'client' ? (
          <BasketOffcanvas
            userId={userId}
            virtualTime={virtualTime}
            show={openBasketOffCanvas}
            setShow={setOpenBasketOffCanvas}
          />
        ) : null}
      </ButtonGroup>
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
