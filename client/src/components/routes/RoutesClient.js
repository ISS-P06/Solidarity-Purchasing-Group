import { RedirectRoute } from '../../utils/route';
import { OrderReview, OrderList, Basket } from '../order';
import { LoginForm } from '..';
import { ClientHomePage } from '../client';
import { Redirect } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { getUserRoute } from '../../utils';

function RoutesClient(props) {
    const {loggedIn, userRole, doLogin, userId, user } = props;

    return (
        <>
            {/* Client-only routes */}
            {/* Client order detail route */}
            <Route
              path="/client/orders/:id"
              render={({ match }) =>
                loggedIn && userRole === 'client' ? (
                  <OrderReview userRole={userRole} userId={userId} id={match.params.id} />
                ) : (
                  <Redirect to={getUserRoute(userRole) || '/'} />
                )
              }
            />

            {/* Client order list route */}
            <RedirectRoute
              path="/client/orders"
              role={userRole}
              condition={loggedIn}
              component={<OrderList userRole={userRole} userId={userId} />}
              redirect={<LoginForm doLogin={doLogin} />}
            />

            {/* Client product browsing route */}
            <RedirectRoute
              path="/client/products"
              role={userRole}
              condition={loggedIn}
              component={<Basket userRole={userRole} userId={userId} />}
              redirect={<LoginForm doLogin={doLogin} />}
            />

            {/* Client home page */}
            <RedirectRoute
              path="/client"
              exact={true}
              role={userRole}
              condition={loggedIn}
              component={<ClientHomePage user={user} />}
              redirect={<LoginForm doLogin={doLogin} />}
            />
        </>
    );
}  

export default RoutesClient;
