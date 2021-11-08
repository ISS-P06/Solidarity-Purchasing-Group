import VirtualClock from "./VirtualClock";
import { Navbar, Col, Button } from "react-bootstrap";
import { BsFillBasket3Fill } from 'react-icons/bs';
import { useHistory } from "react-router-dom";
import {useState} from 'react';
import LoginForm from './LoginForm';

function AppNavbar(props) {
  const doLogin = props.doLogin;
  const loggedIn = props.loggedIn;
  const doLogout = props.doLogout;
  const userRole = props.userRole;
  const [showForm, setShowForm] = useState(false);
  const history = useHistory();

  const handleClick = (path) => {
    history.push(path);
  } 

  const goToUserPage = (role) => {
    switch(role) {
      case "shop_employee":
        handleClick("/employee");
        break;
      default:
        handleClick("/home");
        break;
    }
  }

  const userPageText = (role) => {
    switch(role) {
      case "shop_employee":
        return "Employee page";
      default:
        return "Home page";
    }
  }

  return (
    <Navbar expand="md" bg="primary">
      <Navbar.Brand className="text-light px-4 my-auto ml-md-0">
        <h3>Solidarity Purchasing Group</h3>
      </Navbar.Brand>

      {/* TODO Button on the extreme right */}
      <Navbar.Brand className="mx-auto mb-3">
        <VirtualClock />
      </Navbar.Brand>
    </Navbar>
  );
}

// --- Renders a logout button
function LogoutButton(props) {
  return(
      <Button 
          className = "m-2"
          variant="secondary outline-light" 
          onClick={props.doLogout}>
          Logout
      </Button>
  )
}

export default AppNavbar;
