import { RedirectRoute } from '../../utils/route';
import { FarmerHomePage } from '../farmer';
import { Redirect } from 'react-router-dom';

function RoutesFarmer(props) {
    const {loggedIn, userRole, doLogin, userId} = props;

    return (
        <>
            {/* --- Farmer-only routes --- */}
            {/* Farmer product (descriptor) list route */}
            <RedirectRoute
              path="/farmer/products"
              exact={true}
              role={userRole}
              condition={loggedIn && userRole === 'farmer'}
              component={<div/>}
              redirect={<LoginForm doLogin={doLogin} />}
            />

            {/* Farmer product (descriptor) creation route */}
            <RedirectRoute
              path="/farmer/products/new"
              exact={true}
              role={userRole}
              condition={loggedIn && userRole === 'farmer'}
              component={<div/>}
              redirect={<LoginForm doLogin={doLogin} />}
            />

            {/* Farmer supply route */}
            <RedirectRoute
              path="/farmer/supply"
              exact={true}
              role={userRole}
              condition={loggedIn && userRole === 'farmer'}
              component={<div/>}
              redirect={<LoginForm doLogin={doLogin} />}
            />

            {/* Farmer home page */}
            <RedirectRoute
              path="/farmer"
              exact={true}
              role={userRole}
              condition={loggedIn && userRole === 'farmer'}
              component={<FarmerHomePage user={user} />}
              redirect={<LoginForm doLogin={doLogin} />}
            />
        </>
    );
}  

export default RoutesFarmer;
