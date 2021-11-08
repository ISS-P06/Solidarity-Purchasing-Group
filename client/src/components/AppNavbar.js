import VirtualClock from "./VirtualClock";
import { Navbar, Col, Button, Container, Nav } from "react-bootstrap";
import { BsFillBasket3Fill } from 'react-icons/bs';
import { useHistory } from "react-router-dom";
import {useState} from 'react';
import LoginForm from './LoginForm';

function AppNavbar(props) {
  const loggedIn = props.loggedIn;
  const doLogout = props.doLogout;
  const userRole = props.userRole;
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
        handleClick("/");
        break;
    }
  }

  const userPage = (role) => {
    switch(role) {
      case "shop_employee":
        return "/employee";
      default:
        return "/";
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
    <Navbar collapseOnSelect className="bg-primary text-light" fluid="true" expand="lg">
      <Container>
        <Navbar.Brand>Solidarity Purchasing Group</Navbar.Brand>
        {/* TODO Button on the extreme right */}
        <Navbar.Brand className="mx-auto mb-3">
          <VirtualClock />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='responsive-navbar-nav'/>
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className="">
            {
              loggedIn ?
                <>
                  <Nav.Link onClick = {() => goToUserPage(userRole)}>{ userPageText(userRole) }</Nav.Link>
                  <LogoutLink
                    doLogout={doLogout}/>
                </>
                :
                <>
                  <Nav.Link href="/login">
                      Login
                  </Nav.Link>
                </>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

// --- Renders a logout link
function LogoutLink(props) {
  return(
      <Nav.Link
          onClick={props.doLogout}>
          Logout
      </Nav.Link>
  )
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
