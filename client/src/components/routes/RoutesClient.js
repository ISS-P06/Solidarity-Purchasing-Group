import { RedirectRoute } from '../../utils/route';
import { OrderReview, OrderList } from '../order';
import { ProductCards, LoginForm } from '..';
import { ClientHomePage } from '../client';
import { Redirect, Route} from 'react-router-dom';
import { getUserRoute } from '../../utils';

/**
 *  This component contains all client-only routes.
 */
function RoutesClient(props) {
    const {loggedIn, userRole, doLogin, userId, user, virtualTime, suspendedUser, setOpenBasketOffCanvas} = props;

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
              exact={true}
              role={userRole}
              condition={loggedIn}
              component={<OrderList userRole={userRole} userId={userId} virtualTime={virtualTime}/>}
              redirect={<LoginForm doLogin={doLogin} />}
            />

            {/* Client product browsing route */}
            <RedirectRoute
              path="/client/products"
              role={userRole}
              condition={loggedIn}
              component={<ProductCards userRole={userRole} userId={userId} virtualTime={virtualTime} setOpenBasketOffCanvas={setOpenBasketOffCanvas}/>}
              redirect={<LoginForm doLogin={doLogin} />}
            />

            {/* Client home page */}
            <RedirectRoute
              path="/client"
              exact={true}
              role={userRole}
              condition={loggedIn}
              component={<ClientHomePage user={user} suspended={suspendedUser} />}
              redirect={<LoginForm doLogin={doLogin} />}
            />
        </>
    );
}  

export default RoutesClient;
