import { Redirect, Route } from 'react-router-dom';
import { OrderReview,ClientsList, InsertUser, ProductCards, OrderList, } from '..';
import { getUserRoute, RedirectRoute} from '../../utils';

/**
 *  This component contains all employee-only routes.
 */
function RoutesEmployee(props) {
    const {loggedIn, userRole, virtualTime, setLoggedIn, doLogin, userId} = props;

    return (
        <>
            {/* Shop employee-only routes */}
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
              component={
                  <InsertUser
                      loggedIn={loggedIn}
                      doLogin={doLogin}
                  />
              }
            />

            {/* Employee product browsing route */}
            <RedirectRoute
              path="/employee/products"
              role={userRole}
              condition={loggedIn && userRole === 'shop_employee'}
              component={<ProductCards userRole={userRole} userId={userId} />}
            />

            {/* Employee order detail route */}
            <Route
              path="/employee/orders/:id"
              render={({ match }) =>
                loggedIn && userRole === 'shop_employee' ? (
                  <OrderReview userRole={userRole} userId={userId} id={match.params.id} />
                ) : (
                  <Redirect to={getUserRoute(userRole) || '/'} />
                )
              }
            />

            {/* Employee order list route */}
            <RedirectRoute
              path="/employee/orders"
              exact={true}
              role={userRole}
              condition={loggedIn && userRole === 'shop_employee'}
              component={<OrderList userRole={userRole} userId={userId} virtualTime={virtualTime} />}
            />

            {/* Employee home page route (redirects to client list, see above) */}
            <RedirectRoute
              path="/employee"
              role={userRole}
              condition={loggedIn && userRole === 'shop_employee'}
              component={<Redirect to="/employee/clients" />}
            />
        </>
    );
}  

export default RoutesEmployee;