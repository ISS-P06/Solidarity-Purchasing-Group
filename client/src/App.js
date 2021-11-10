import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Col, Container } from 'react-bootstrap';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import AppNavbar from './components/AppNavbar';
import OrderList from './components/OrderList';

import OrderReview from './components/OrderReview';

function App() {
  
  return (
    <Container className="App bg-light text-dark p-0 m-0 min-vh-100" fluid>
      <AppNavbar />
      <Router>
        <Switch>
          <Route exact path="/api/orders">
            <OrderList />
          </Route>
          <Route exact path="/api/orders/:id">
            <OrderReview />
          </Route>
        </Switch>
      </Router>
    </Container>
  );
}

export default App;
