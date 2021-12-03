import { RedirectRoute } from '../../utils/route';
import { checkOrderInterval } from '../../utils/date';
import { OrderReview } from '..';
import { Redirect } from 'react-router-dom';

function RoutesEmployee(props) {
    const {loggedIn, userRole, virtualTime, setLoggedIn, doLogin, userId} = props;

    return (
        <>
            {/* Shop employee-only routes */}
            
            {/* Employee client info route */}
            <Route
              path="/employee/clients/:id"
              render={({ match }) =>
                loggedIn && userRole === 'shop_employee' ? (
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
              component={
                <InsertClient loggedIn={loggedIn} setLoggedIn={setLoggedIn} doLogin={doLogin} />
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

            {/* Employee order creation route */}
            <RedirectRoute
              path="/employee/orders/new"
              role={userRole}
              condition={
                loggedIn && userRole === 'shop_employee' && checkOrderInterval(virtualTime)
              }
              component={<div />}
            />

            {/* Employee order list route */}
            <RedirectRoute
              path="/employee/orders"
              role={userRole}
              condition={loggedIn && userRole === 'shop_employee'}
              component={<OrderList userRole={userRole} userId={userId} />}
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