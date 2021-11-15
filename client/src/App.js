import logo from "./logo.svg";
import "./App.css";
import { Navbar, Col, Container, Row, Button } from "react-bootstrap";
import AppNavbar from "./components/AppNavbar";
import InsertClient from "./components/insertClient";
import ProductCards from "./components/ProductCards";
import { useState, useEffect } from "react";
import { api_getProducts } from "./Api";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import ShopEmployeeActionsList from "./components/ShopEmployeeActionsList";
import ClientsList from "./components/ClientsList";
import AlertBox from "./components/Message";
import { FaBars } from "react-icons/fa";

function App() {
  // Product: { id, name, description, category, quantity, price }
  const [productList, setProductList] = useState([]);

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

  return (
    <Container
      className="App bg-light text-dark p-0 m-0 min-vh-100"
      fluid="true"
    >
      <AppNavbar />

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
