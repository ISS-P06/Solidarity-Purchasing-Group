import logo from "./logo.svg";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Col, Container, Row, Button } from "react-bootstrap";
import AppNavbar from "./components/AppNavbar";
import InsertClient from "./components/insertClient";
import ProductCards from "./components/ProductCards";
import { useState, useEffect } from "react";

import ShopEmployeeActionsList from "./components/ShopEmployeeActionsList";
import ClientsList from "./components/ClientsList";
import AlertBox from "./components/Message";
import { FaBars } from "react-icons/fa";

import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import VirtualClock from './components/VirtualClock';
import { api_getProducts, api_getUserInfo, api_login, api_logout } from './Api';

function App() {
  // Product: { id, name, description, category, quantity, price }
  const [productList, setProductList] = useState([]);
  
  // Session-related states
  const [loggedIn, setLoggedIn] = useState(false);
  /*
    userRole: current user's role; possible values:
    - shop_employee
    - (empty string/none, i.e. not logged in)

    other values will be considered in subsequent sprints
    when necessary
  */
  const [userRole, setUserRole] = useState("");

  /* for giving feedback to the user*/
  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState(false);

  const [toggled, setToggled] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapsedChange = (checked) => {
    setCollapsed(checked);
  };

  const handleToggleSidebar = (value) => {
    setToggled(value);
  };

  useEffect(() => {
    if (message !== "") {
      setAlert(true);
    }
  }, [message]);

  // useEffect for getting user info
  useEffect(()=> {
    const checkAuth = async() => {
      try {
        const info = await api_getUserInfo();
        setLoggedIn(true);
        setUserRole(info.role);
      } catch(err) {
        console.error(err);
      }
    };
    checkAuth();
  }, [loggedIn]);

  // async function for logging in
  const doLogin = async (credentials) => {
    try {
      await api_login(credentials);
      setLoggedIn(true);
      return {done: true, msg: "ok"};
    } catch(err) {
      return {done: false, msg: err.message};
    }
  }

  // async function for logging out
  const doLogout = async () => {
    await api_logout();
    setLoggedIn(false);
  }

  return (
    <Container
      className="App bg-light text-dark p-0 m-0 min-vh-100"
      fluid="true"
    >
      <AppNavbar
        loggedIn={loggedIn}
        doLogout={doLogout}
        doLogin={doLogin}/>

      <AlertBox alert={alert} setAlert={setAlert} message={message} />

      <Router>
        <Switch>
          <Row className="m-auto">
            <Col xs={2} className="p-0">
              {/* This button shows up when the sidebar is hidden */}
              <Button
                className="btn-toggle m-2"
                onClick={() => handleToggleSidebar(true)}
              >
                <FaBars />
              </Button>

              {/* Aside */}
              <ShopEmployeeActionsList
                toggled={toggled}
                collapsed={collapsed}
                handleToggleSidebar={handleToggleSidebar}
                setMessage={setMessage}
              />
            </Col>

            <Col xs={10}>
              <Route exact path="/insert-client">
                <InsertClient />
              </Route>
              <Route exact path="/browse-products">
                <ProductCards />
              </Route>
              <Route exact path="/show-clients">
                <ClientsList setMessage={setMessage} />
              </Route>
            </Col>
          </Row>
        </Switch>
      </Router>
    </Container>
  );
}

export default App;
