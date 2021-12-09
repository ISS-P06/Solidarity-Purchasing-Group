import { RedirectRoute } from '../../utils/route';
import { LoginForm} from '../';
import ReportAvailabilityProductsPage from "../farmer/ReportAvailabilityProductsPage"
import { FarmerHomePage, FarmerProductForm } from '../farmer';
import ProductCards from '../product/ProductCards';

/**
 *  This component contains all farmer-only routes.
 */
function RoutesFarmer(props) {
    const {loggedIn, userRole, doLogin, userId, user, virtualTime} = props;

    return (
        <>
            {/* --- Farmer-only routes --- */}
            {/* Farmer product (descriptor) creation route */}
            <RedirectRoute
              path="/farmer/products/new"
              exact={true}
              role={userRole}
              condition={loggedIn && userRole === 'farmer'}
              component={<FarmerProductForm userId={userId} />}
              redirect={<LoginForm doLogin={doLogin} />}
            />
            
            {/* Farmer product (descriptor) list route */}
            <RedirectRoute
              path="/farmer/products"
              exact={true}
              role={userRole}
              condition={loggedIn && userRole === 'farmer'}
              component={<ProductCards userRole={userRole} userId={userId} virtualTime={virtualTime} />}
              redirect={<LoginForm doLogin={doLogin} />}
            />

            {/* Farmer supply route */}
            <RedirectRoute
              path="/farmer/supply"
              exact={true}
              role={userRole}
              condition={loggedIn && userRole === 'farmer'}
              component={<ReportAvailabilityProductsPage user={user}/>}
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
