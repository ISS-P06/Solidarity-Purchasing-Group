import {useState, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import {Col, Container, Row, Button} from 'react-bootstrap';
import {FaBars} from 'react-icons/fa';
import { useHistory } from 'react-router-dom';

import {
    ClientsList,
    InsertClient,
    LoginForm,
    OrderList,
    OrderReview,
    ProductCards,
    Basket,
    ClientHomePage,
  Notification,
  AppNavbar,
  LoginForm,
  ProductCards,
  ShopEmployeeActionsList,
  InsertClient
} from './components';

import RoutesEmployee from './components/routes/RoutesEmployee';
import RoutesClient from './components/routes/RoutesClient';
import RoutesFarmer from './components/routes/RoutesFarmer';
import RedirectUser from './components/routes/RedirectUser';

import Basket from './components/order/Basket'

import { api_getUserInfo, api_login, api_logout, api_getTime } from './Api';

function App() {
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
  const [userId, setUserId] = useState();

  // This state is used to update (and monitor) the time on front-end
  // Some functionalities can be used only at a certain time
  const [dirtyVT, setDirtyVT] = useState(true);

  // State used to store the system's virtual time
  const [virtualTime, setVirtualTime] = useState({});

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

  // useEffect for getting user info
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const info = await api_getUserInfo();
        setLoggedIn(true);
        setUserRole(info.role);
        setUserId(info.id);
      } catch (err) {
        setUserRole('');
        console.error(err);
      }
    };
    checkAuth();
  }, [loggedIn]);

  // useEffect used to get the system's virtual time
  useEffect(() => {
    const getVT = async () => {
      try {
        const data = await api_getTime();
        setVirtualTime(new Date(data.currentTime));
        setDirtyVT(false);
      } catch (err) {
        setVirtualTime(new Date().toISOString());
        setDirtyVT(false);
        console.error(err);
      }
    };
    getVT();
  }, [dirtyVT]);

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
        <AppNavbar 
          loggedIn={loggedIn} 
          doLogout={doLogout} 
          userRole={userRole} 
          dirtyVT={dirtyVT}
          setDirtyVT={setDirtyVT} 
          virtualTime={virtualTime}
          />
        <Notification />
        {/*<AlertBox alert={alert} setAlert={setAlert} message={message} />*/}
        


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
              <Route path="/register">
                {!loggedIn ?  <InsertClient loggedIn={loggedIn}/>  : "" } {/*TODO: page of the user registered*/}
              </Route>
              {/* Shop employee-only routes */}
              <RoutesEmployee
                loggedIn={loggedIn}
                userRole={userRole}
                userId={userId}
                setMessage={setMessage}
                virtualTime={virtualTime}
                dirtyVT={dirtyVT}
                />

              {/* Client-only routes */}
              <RoutesClient
                loggedIn={loggedIn}
                userRole={userRole}
                userId={userId}
                />

              {/* Farmer-only routes */}
              <RoutesFarmer
                loggedIn={loggedIn}
                userRole={userRole}
                />

              {/* Home page route */}
              <Route path="/">
                {/* ???????? */}
                <Basket userId="4"/>
                <ProductCards userRole="client" userId="4" />
                <div />
                <Basket userId={userId}/>
              </Route>

              {/* Default route; redirects to / */}
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

export default App;
