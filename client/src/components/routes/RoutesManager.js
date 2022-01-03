import { RedirectRoute } from '../../utils/route';
import { LoginForm} from '../';
import { ManagerHomePage } from '../manager';
import ProductCards from '../product/ProductCards';

/**
 *  This component contains all farmer-only routes.
 */
function RoutesManager(props) {
    const {loggedIn, userRole, doLogin, userId, user, virtualTime} = props;
    console.log(props);
    return (
        <>
            {/* Farmer home page */}
            <RedirectRoute
              path="/manager"
              exact={true}
              role={userRole}
              condition={loggedIn && userRole === 'manager'}
              component={<ManagerHomePage user={user} />}
              redirect={<LoginForm doLogin={doLogin} />}
            />
        </>
    );
}  

export default RoutesManager;
