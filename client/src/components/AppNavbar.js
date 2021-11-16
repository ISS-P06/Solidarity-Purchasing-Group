import VirtualClock from './VirtualClock';
import { Navbar,  Nav } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import {GrBasket} from 'react-icons/gr';
import {BsBasket2} from 'react-icons/bs';
function AppNavbar(props) {
  const loggedIn = props.loggedIn;
  const doLogout = props.doLogout;
  const userRole = props.userRole;
  const history = useHistory();

  const handleClick = (path) => {
    history.push(path);
  };

  const goToUserPage = (role) => {
    switch (role) {
      case 'shop_employee':
        handleClick('/employee');
        break;
      default:
        handleClick('/');
        break;
    }
  };

  const userPageText = (role) => {
    switch (role) {
      case 'shop_employee':
        return 'Employee page';
      default:
        return 'Home page';
    }
  };

  return (
    <Navbar collapseOnSelect className=" navbar text-light" fluid="true" expand="lg">
     
        <Navbar.Brand style={{color:"#fff"}}> <BsBasket2 size={30} /> Solidarity Purchasing Group</Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
        <VirtualClock />
          <Nav className="">
            {loggedIn ? (
              <>
                <Nav.Link onClick={() => goToUserPage(userRole)}>{userPageText(userRole)}</Nav.Link>
                <LogoutLink doLogout={doLogout} />
              </>
            ) : (
              <Nav.Link onClick={() => handleClick('/login')}>Login</Nav.Link>
            )}
          </Nav>
       
        </Navbar.Collapse>
    
    </Navbar>
  );
}

// --- Renders a logout link
function LogoutLink(props) {
  return <Nav.Link onClick={props.doLogout}>Logout</Nav.Link>;
}

export default AppNavbar;
