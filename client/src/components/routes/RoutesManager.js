import { RedirectRoute } from '../../utils/route';
import { LoginForm} from '../';
import { ManagerHomePage, Report } from '../manager';

/**
 *  This component contains all manager-only routes.
 */
function RoutesManager(props) {
    const {loggedIn, userRole, doLogin, virtualTime} = props;

    return (
        <>
            {/* --- Manager-only routes --- */}
            {/* Manager weekly report route */}
            <RedirectRoute
              path="/manager/report/weekly"
              exact={true}
              role={userRole}
              condition={loggedIn && userRole === 'manager'}
              component={<Report type="Weekly" virtualTime={virtualTime} />}
              redirect={<LoginForm doLogin={doLogin} />}
            />
            
            {/* Manager monthly report route */}
            <RedirectRoute
              path="/manager/report/monthly"
              exact={true}
              role={userRole}
              condition={loggedIn && userRole === 'manager'}
              component={<Report type="Monthly" virtualTime={virtualTime} />}
              redirect={<LoginForm doLogin={doLogin} />}
            />

            {/* Manager home page */}
            <RedirectRoute
              path="/manager"
              exact={true}
              role={userRole}
              condition={loggedIn && userRole === 'manager'}
              component={<ManagerHomePage/>}
              redirect={<LoginForm doLogin={doLogin} />}
            />
        </>
    );
}  

export default RoutesManager;
