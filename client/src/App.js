import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Col, Container } from 'react-bootstrap';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import AppNavbar from './components/AppNavbar';
import OrderList from './components/OrderList';



import api_doDelivery from './Api';
import OrderReview from './components/OrderReview';

/*
function api_getOrderList() {

  const orderListData = [ 
    {
      orderId: 123,
      email: 'goophy@disney.com',
    },
    {
      orderId: 124,
      email: 'donald@disney.com',
    } 
  ]

  return orderListData;
}
*/
function api_getOrderReview(id) {

  const orderReview1 = {
    orderId: 123,
    email: 'goophy@disney.com',
    products: [
      {
        productName: 'Apple',
        quantity: 3,
        price: 1.50,
      },
      {
        productName: 'Banana',
        quantity: 2,
        price: 2.30,
      }
    ],
    state: 'pending'
  };

  if(orderReview1.orderId == id)
    return orderReview1;

    const orderReview2 = {
      orderId: 124,
      email: 'donald@disney.com',
      products: [
        {
          productName: 'Apple',
          quantity: 4,
          price: 1.50,
        },
        {
          productName: 'Banana',
          quantity: 1,
          price: 2.30,
        }
      ],
      state: 'pending'
    };

    if(orderReview2.orderId == id)
    return orderReview2;
}

function App() {

  
  
  const doDelivery = async (orderId) => {
    /*
    try {
      await api_doDelivery(orderId);
      return { done: true, msg: 'ok' };
    } catch (err) {
      return { done: false, msg: err.message };
    }
    */
  };

 const getOrderReview = (orderId) => {
    /*
    try {
      await api_getOrderReview(orderId);
      return { done: true, msg: 'ok' };
    } catch (err) {
      return { done: false, msg: err.message };
    }
    */
    return api_getOrderReview(orderId);

  };
  
  


  return (
    <Container className="App bg-light text-dark p-0 m-0 min-vh-100" fluid>
      <AppNavbar />
      <Router>
        <Switch>
          <Route exact path="/api/orders">
            <OrderList />
          </Route>
          <Route exact path="/api/orders/:id" render={({match}) =>
            <OrderReview orderReview={getOrderReview(match.params.id)} onDelivery={doDelivery}/>
          }/>
        </Switch>
      </Router>
    </Container>
  );
}

export default App;
