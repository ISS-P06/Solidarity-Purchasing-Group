import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Col, Container } from 'react-bootstrap';
import AppNavbar from './components/AppNavbar';
import InsertClient from "./components/insertClient";
import { useState, useEffect } from 'react';
import { api_getProducts } from './Api';
import {Route, BrowserRouter as Router, Switch} from "react-router-dom";

function App() {

  // Product: { id, name, description, category, quantity, price }
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    api_getProducts()
      .then((products) => {
        setProductList(products);
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <Container className="App bg-light text-dark p-0 m-0 min-vh-100"  fluid>
      <Router >
        <AppNavbar/>
          <Switch>
              <Route exact path = '/insert-client'  >
                  <InsertClient/>
              </Route>

          </Switch>
      </Router>
    </Container>
  );
}

export default App;
