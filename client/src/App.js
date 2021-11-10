import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Col, Container } from 'react-bootstrap';
import AppNavbar from './components/AppNavbar';
import { useState, useEffect } from 'react';
import { api_getProducts } from './Api';
import VirtualClock from './components/VirtualClock';

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
    <Container className="App bg-light text-dark p-0 m-0 min-vh-100" fluid>
      <AppNavbar/>
      <VirtualClock/>
    </Container>
  );
}

export default App;
