import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import {
  InsertClient,
  LoginForm
} from './components';

import {
  RoutesEmployee,
  RoutesClient,
  RoutesFarmer
} from './components/routes';

import HomePage from './containers/HomePage';
import { Layout } from './containers';
import { getUserRoute, RedirectRoute } from './utils/route.js';
import { addMessage } from './components/Message';
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

  const RoutesEmployeeProps = {
    loggedIn,
    setLoggedIn,
    doLogin,
    userRole,
    userId,
    virtualTime,
  };

  const RoutesClientProps = {
    loggedIn,
    doLogin,
    userRole,
    userId
  };

  const RoutesFarmerProps = {
    loggedIn,
    doLogin,
    userRole,
    userId
  };

  return (
    <div className="app-container">
      <Router>
        <Switch>
          <Layout {...LayoutProps}>
            {/* --- Employee-only routes --- */}
            <RoutesEmployee
              {... RoutesEmployeeProps}/>

            {/* --- Client-only routes --- */}
            <RoutesClient
              {...RoutesClientProps}/>

            {/* --- Farmer-only routes --- */}
            <RoutesFarmer
              {...RoutesFarmerProps}/>

            {/* --- Default routes --- */}
            {/* User registration route */}
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

            {/* Login route */}
            <RedirectRoute
              path="/login"
              exact={true}
              role={userRole}
              condition={!loggedIn}
              component={<LoginForm doLogin={doLogin} />}
            />

            {/* Homepage route */}
            <Route exact path="/">
              <HomePage />
            </Route>

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
