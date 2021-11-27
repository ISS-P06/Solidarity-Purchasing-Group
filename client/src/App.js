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
} from './components';

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
        console.log(data);
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
                {loggedIn && userRole === 'shop_employee' ? (
                  <ClientsList 
                    setMessage={setMessage} 
                    virtualTime={virtualTime} />
                ) : (
                  <RedirectUser userRole={userRole} />
                )}
              </Route>

              {/* Employee client registration route */}
              <Route path="/employee/register">
                {loggedIn && userRole == 'shop_employee' ? (
                  <InsertClient loggedIn={loggedIn}/>
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
                <Basket userId={userId}/>
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

    const handleToggleSidebar = (value) => {
        setToggled(value);
    };
  
    /* for giving feedback to the user*/
    const [message, setMessage] = useState('');
    const [alert, setAlert] = useState(false);
  
    // async function for logging in
    const doLogin = async (credentials) => {
        try {
            await api_login(credentials);
            setLoggedIn(true);
            return {done: true, msg: 'ok'};
        } catch (err) {
            return {done: false, msg: err.message};
        }
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
                setUserId(info.id);
                setUser(info);
                console.log(info);
            } catch (err) {
                setUserRole('');
                console.error(err);
            }
        };
        checkAuth();
         }, [loggedIn]);

    // async function for logging out
    const doLogout = async () => {
        api_logout();
        addMessage({title:'Logout',message: 'You are now logged out'});
        setLoggedIn(false);
    };

    const LayoutProps = {
        loggedIn,
        doLogout,
        userRole,
    };
 

    return (
        <div className="app-container">
            <Router>
                <Switch>
                    <Layout {...LayoutProps}>
                        <Route exact path="/">
                            <HomePage/>
                        </Route>

                        <Route exact path="/register">
                            <InsertClient loggedIn={loggedIn} setLoggedIn={setLoggedIn} user={user} setUser={setUser}/>
                        </Route>
                        <RedirectRoute
                            path="/login"
                            role={userRole}
                            condition={!loggedIn}
                            component={<LoginForm doLogin={doLogin}/>}
                        />

                        <RedirectRoute
                            path="/client"
                            role={userRole}
                            condition={loggedIn}
                            component={<ClientHomePage user={user}/>}
                            redirect={<LoginForm doLogin={doLogin}/>}
                        />

  <Route path="/farmer">
                                <FarmerHomePage user={user}/>
                            </Route>

                        {/* Shop employee-only routes */}

                        {/* Employee: client info page route */}
                        {/* Employee: client info page route */}
                        <Route
                            path="/employee"
                            render={({match}) =>
                                loggedIn ? (
                                    <div id={match.params.id}/>
                                ) : (
                                    <Redirect to={getUserRoute(userRole) || '/'}/>
                                )
                            }
                        />
                        <Route
                            path="/employee/clients/:id"
                            render={({match}) =>
                                loggedIn ? (
                                    <div id={match.params.id}/>
                                ) : (
                                    <Redirect to={getUserRoute(userRole) || '/'}/>
                                )
                            }
                        />
                        {/* Employee client list route */}
                        <RedirectRoute
                            path="/employee/clients"
                            role={userRole}
                            condition={loggedIn && userRole === 'shop_employee'}
                            component={<ClientsList/>}
                        />

                        {/* Employee client registration route */}
                        <RedirectRoute
                            path="/employee/register"
                            role={userRole}
                            condition={loggedIn && userRole === 'shop_employee'}
                            component={<InsertClient loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>}
                        />

                        {/* Employee product browsing route */}
                        <RedirectRoute
                            path="/employee/products"
                            role={userRole}
                            condition={loggedIn && userRole === 'shop_employee'}
                            component={<ProductCards userRole={userRole} userId={userId}/>}
                        />

                        {/* Employee: order info page route */}
                        <RedirectRoute
                            path="/employee/orders/:id"
                            role={userRole}
                            condition={loggedIn && userRole === 'shop_employee'}
                            component={<OrderReview userRole={userRole}/>}
                        />

                        {/* Employee order list route */}
                        <RedirectRoute
                            path="/employee/orders"
                            role={userRole}
                            condition={loggedIn && userRole === 'shop_employee'}
                            component={<OrderList userRole={userRole} userId={userId}/>}
                        />

                        {/* Employee order creation route */}
                        <RedirectRoute
                            path="/employee/orders/new"
                            role={userRole}
                            condition={loggedIn && userRole === 'shop_employee'}
                            component={<div/>}
                        />

                        {/* Employee home page route */}
                        <RedirectRoute
                            path="/employee"
                            role={userRole}
                            condition={loggedIn && userRole === 'shop_employee'}
                            component={<div/>}
                        />

                        {/* Home page route */}
                        <Route path="/">
                            {/* Replace div with homepage component */}
                            {/* <HomePage /> */}
                            {/* <Basket userId={userId} /> */}
                        </Route>
                    </Layout>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
