import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Col, Container, Row, Button } from 'react-bootstrap';
import { FaBars } from 'react-icons/fa';

import {
  AlertBox,
  AppNavbar,
  ClientsList,
  InsertClient,
  LoginForm,
  OrderList,
  OrderReview,
  ProductCards,
  ShopEmployeeActionsList,
} from './components';

import { api_getUserInfo, api_login, api_logout } from './Api';

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
  const [userRole, setUserRole] = useState('');

  /* for giving feedback to the user*/
  const [message, setMessage] = useState('');
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
    if (message !== '') {
      setAlert(true);
    }
  }, [message]);

  // useEffect for getting user info
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const info = await api_getUserInfo();
        setLoggedIn(true);
        setUserRole(info.role);
      } catch (err) {
        setUserRole('');
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
      return { done: true, msg: 'ok' };
    } catch (err) {
      return { done: false, msg: err.message };
    }
  };

  // async function for logging out
  const doLogout = async () => {
    await api_logout();
    setLoggedIn(false);
  };

  // useEffect for getting user info
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const info = await api_getUserInfo();
        setLoggedIn(true);
        setUserRole(info.role);
      } catch (err) {
        setUserRole('');
        console.error(err);
      }
    };
    checkAuth();
  }, [loggedIn]);

  return (
    <Container className="App text-dark p-0 m-0 min-vh-100" fluid="true">
      <Router>
        <AppNavbar loggedIn={loggedIn} doLogout={doLogout} userRole={userRole} />

        <AlertBox alert={alert} setAlert={setAlert} message={message} />

        <Row className="m-auto">
          {loggedIn && userRole == 'shop_employee' ? (
            <Col xs={1} md={4} lg={2} className="p-0">
              {/* This button shows up when the sidebar is hidden */}
              <Button
                className="btn-toggle m-2"
                onClick={() => handleToggleSidebar(true)}
                className={toggled ? 'd-none' : 'btn-toggle'}>
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
          ) : (
            <div />
          )}

          {/*<Col xs={11} md={8} lg={10}>*/}
          <Col>
            <Switch>
              {/* Login route */}
              <Route path="/login">
                {loggedIn ? <RedirectUser userRole={userRole} /> : <LoginForm doLogin={doLogin} />}
              </Route>
              {/* Shop employee-only routes */}

              {/* Employee: client info page route */}
              <Route
                path="/employee/clients/:id"
                render={({ match }) => {
                  if (loggedIn) {
                    return <div id={match.params.id} />;
                  } else {
                    return <RedirectUser userRole={userRole} />;
                  }
                }}
              />
              {/* Employee client list route */}
              <Route path="/employee/clients">
                {loggedIn && userRole == 'shop_employee' ? (
                  <ClientsList setMessage={setMessage} />
                ) : (
                  <RedirectUser userRole={userRole} />
                )}
              </Route>

              {/* Employee client registration route */}
              <Route path="/employee/register">
                {loggedIn && userRole == 'shop_employee' ? (
                  <InsertClient />
                ) : (
                  <RedirectUser userRole={userRole} />
                )}
              </Route>

              {/* Employee product browsing route */}
              <Route path="/employee/products">
                {loggedIn && userRole == 'shop_employee' ? (
                  <ProductCards />
                ) : (
                  <RedirectUser userRole={userRole} />
                )}
              </Route>

              {/* Employee: order info page route */}
              <Route path="/employee/orders/:id">
                {loggedIn ? <OrderReview /> : <RedirectUser userRole={userRole} />}
              </Route>

              {/* Employee order list route */}
              <Route path="/employee/orders">
                {loggedIn && userRole == 'shop_employee' ? (
                  <OrderList />
                ) : (
                  <RedirectUser userRole={userRole} />
                )}
              </Route>

              {/* Employee order creation route */}
              <Route path="/employee/orders/new">
                {loggedIn && userRole == 'shop_employee' ? (
                  <div />
                ) : (
                  <RedirectUser userRole={userRole} />
                )}
              </Route>

              {/* Employee home page route */}
              <Route path="/employee">
                {loggedIn && userRole == 'shop_employee' ? (
                  <div />
                ) : (
                  <RedirectUser userRole={userRole} />
                )}
              </Route>

              {/* Home page route */}
              <Route path="/">
                {/* Replace div with homepage component */}
                <div />
              </Route>

              <Route>
                <Redirect to="/" />
              </Route>
            </Switch>
          </Col>
        </Row>
      </Router>
    </Container>
  );
}

function RedirectUser(props) {
  const userRole = props.userRole;

  const renderSwitch = (role) => {
    switch (role) {
      case 'shop_employee':
        return <Redirect to="/employee" />;
      default:
        return <Redirect to="/" />;
    }
  };

  return renderSwitch(userRole);
}

export default App;
