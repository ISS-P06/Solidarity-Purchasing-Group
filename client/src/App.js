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
import { api_getUserInfo, api_login, api_logout } from './Api';
import FarmerHomePage from './components/farmer/FarmerHomePage';

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
        console.error(err);
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
  };

  return (
    <div className="app-container">
      <Router>
        <Switch>
          <Layout {...LayoutProps}>
            <Route exact path="/">
              <HomePage />
            </Route>

            <RedirectRoute
              path="/login"
              role={userRole}
              condition={!loggedIn}
              component={<LoginForm doLogin={doLogin} />}
            />

            <RedirectRoute
              path="/client"
              role={userRole}
              condition={loggedIn}
              component={<ClientHomePage user={user} />}
              redirect={<LoginForm doLogin={doLogin} />}
            />

            <RedirectRoute
              path="/farmer"
              role={userRole}
              condition={loggedIn}
              component={<FarmerHomePage user={user} />}
              redirect={<LoginForm doLogin={doLogin} />}
            />

            {/* Shop employee-only routes */}

            {/* Employee: client info page route */}
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
              component={<ClientsList />}
            />

            {/* Employee client registration route */}
            <RedirectRoute
              path="/employee/register"
              role={userRole}
              condition={loggedIn && userRole === 'shop_employee'}
              component={<InsertClient />}
            />

            {/* Employee product browsing route */}
            <RedirectRoute
              path="/employee/products"
              role={userRole}
              condition={loggedIn && userRole === 'shop_employee'}
              component={<ProductCards userRole={userRole} userId={userId} />}
            />

            {/* Employee: order info page route */}
            <RedirectRoute
              path="/employee/orders/:id"
              role={userRole}
              condition={loggedIn && userRole === 'shop_employee'}
              component={<OrderReview userRole={userRole} />}
            />

            {/* Employee order list route */}
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
              condition={loggedIn && userRole === 'shop_employee'}
              component={<div />}
            />

            {/* Employee home page route */}
            <RedirectRoute
              path="/employee"
              role={userRole}
              condition={loggedIn && userRole === 'shop_employee'}
              component={<div />}
            />

            {/* Client-only routes */}

            {/*
              Routes to test client orders component
              TO DO: remove or improve these routes
              Thank you, Marco
              */}
            <Route path="/client/orders/:id">
              <OrderReview userRole="client" userId="4" />
            </Route>
            <Route path="/client/orders">
              <OrderList userRole="client" userId="4" />
            </Route>

            <RedirectRoute
              path="/basket"
              role={userRole}
              condition={loggedIn && userRole === 'client'}
              component={<Basket userRole={userRole} userId={4} />}
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
