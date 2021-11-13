import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Col, Container, Row } from "react-bootstrap";
import AppNavbar from "./components/AppNavbar";
import InsertClient from "./components/insertClient";
import { useState, useEffect } from "react";
import { api_getProducts } from "./Api";
import VirtualClock from "./components/VirtualClock";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import ShopEmployeeActionsList from "./components/ShopEmployeeActionsList";
import ClientsList from "./components/ClientsList";
import AlertBox from "./components/Message";
function App() {
  // Product: { id, name, description, category, quantity, price }
  const [productList, setProductList] = useState([]);

  /* for giving feedback to the user*/
  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState(false);


  useEffect(() => {
    if (message !== "") {
      setAlert(true);
    }
  }, [message]);

  return (

    <Container className="App bg-light text-dark p-0 m-0 min-vh-100" fluid>
      <AppNavbar />
      <AlertBox alert={alert} setAlert={setAlert} message={message} />
      <Row>
        <Col className="collapse d-md-block p-0" lg="3">
          <ShopEmployeeActionsList setMessage={setMessage} />
        </Col>
        <ClientsList
          alert={alert}
          setAlert={setAlert}
          message={message}
          setMessage={setMessage}
        />
      </Row>
      <Router>
        <VirtualClock />
        <Switch>
          <Route exact path="/insert-client">
            <InsertClient />
          </Route>
        </Switch>
      </Router>
    </Container>
  );
}

export default App;
