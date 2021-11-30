import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

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

import HomePage from './containers/HomePage';
import { Layout } from './containers';
import { getUserRoute, RedirectRoute } from './utils/route.js';
import { addMessage } from './components/Message';
import { api_getUserInfo, api_login, api_logout, api_getTime } from './Api';
import FarmerHomePage from './components/farmer/FarmerHomePage';
import { checkOrderInterval } from './utils/date';

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
  const [user, setUser] = useState();
  // This state is used to update (and monitor) the time on front-end
  // Some functionalities can be used only at a certain time
  const [dirtyVT, setDirtyVT] = useState(true);

  // State used to store the system's virtual time
  const [virtualTime, setVirtualTime] = useState({});

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

  // useEffect for getting user info
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const info = await api_getUserInfo();
        setUser(info);
        setUserId(info.id);
        setUserRole(info.role);
        setLoggedIn(true);
      } catch (err) {
        setUserRole('');
        console.error(err.message);
      }
    };
    checkAuth();
  }, [loggedIn]);

  // async function for logging out
  const doLogout = async () => {
    api_logout();
    addMessage({ title: 'Logout', message: 'You are now logged out' });
    setLoggedIn(false);
  };
  const LayoutProps = {
    loggedIn,
    doLogout,
    userRole,
    dirtyVT,
    setDirtyVT,
    virtualTime,
  };
  console.log(LayoutProps);

  return (
    <div className="app-container">
      <Router>
        <Switch>
          <Layout {...LayoutProps}>
            

            <Route exact path="/register">
              <InsertClient
                loggedIn={loggedIn}
                setLoggedIn={setLoggedIn}
                user={user}
                setUser={setUser}
                setUserRole={setUserRole}
                doLogin={doLogin}
              />
            </Route>

            {/* Default routes */}
            <RedirectRoute
              path="/login"
              exact={true}
              role={userRole}
              condition={!loggedIn}
              component={<LoginForm doLogin={doLogin} />}
            />


            <RedirectRoute
              path="/client"
              exact={true}
              role={userRole}
              condition={loggedIn}
              component={<ClientHomePage user={user} />}
              redirect={<LoginForm doLogin={doLogin} />}
            />

            <RedirectRoute
              path="/farmer"
              exact={true}
              role={userRole}
              condition={loggedIn}
              component={<FarmerHomePage user={user} />}
              redirect={<LoginForm doLogin={doLogin} />}
            />

            
            <Route exact path="/">
                <HomePage />
            </Route>

            {/* Client-only routes */}

            <RedirectRoute
              path="/client/orders"
              role={userRole}
              condition={loggedIn}
              component={<OrderList userRole={userRole} userId={userId} />}
              redirect={<LoginForm doLogin={doLogin} />}
            />

            <RedirectRoute
              path="/client/products"
              role={userRole}
              condition={loggedIn}
              component={<Basket userRole={userRole} userId={userId} />}
              redirect={<LoginForm doLogin={doLogin} />}
            />

            {/* Shop employee-only routes */}
            {/* Employee: client info page route */}
            <Route
              path="/employee"
              render={({ match }) =>
                loggedIn ? (
                  <div id={match.params.id} />
                ) : (
                  <Redirect to={getUserRoute(userRole) || '/'} />
                )
              }
            />

            <Route
              path="/employee/clients/:id"
              render={({ match }) =>
                loggedIn ? (
                  <div id={match.params.id} />
                ) : (
                  <Redirect to={getUserRoute(userRole) || '/'} />
                )
              }
            />
            {/* Employee client list route */}
            <RedirectRoute
              path="/employee/clients"
              role={userRole}
              condition={loggedIn && userRole === 'shop_employee'}
              component={<ClientsList virtualTime={virtualTime} />}
            />

            {/* Employee client registration route */}
            <RedirectRoute
              path="/employee/register"
              role={userRole}
              condition={loggedIn && userRole === 'shop_employee'}
              component={<InsertClient loggedIn={loggedIn} setLoggedIn={setLoggedIn} doLogin={doLogin}/>}
            />

            {/* Employee product browsing route */}
            <RedirectRoute
              path="/employee/products"
              role={userRole}
              condition={loggedIn && userRole === 'shop_employee'}
              component={<ProductCards userRole={userRole} userId={userId} />}
            />

            {/* Employee orders route */}
            <RedirectRoute
              path="/employee/orders"
              role={userRole}
              condition={loggedIn && userRole === 'shop_employee'}
              component={<OrderList userRole={userRole} userId={userId} />}
            />

            {/* Employee order creation route */}
            <RedirectRoute
              path="/employee/orders/new"
              role={userRole}
              condition={
                loggedIn && userRole === 'shop_employee' && checkOrderInterval(virtualTime)
              }
              component={<div />}
            />

            {/* Employee home page route */}
            <RedirectRoute
              path="/employee"
              role={userRole}
              condition={loggedIn && userRole === 'shop_employee'}
              component={<Redirect to="/employee/clients" />}
            />

            {/* Default redirect the user on his default route */}
            <Route>
              <Redirect to={getUserRoute(userRole)} />
            </Route>

          </Layout>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
