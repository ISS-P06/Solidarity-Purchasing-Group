import { Route } from 'react-router-dom';
import RedirectUser from './RedirectUser'; 

function RoutesFarmer(props) {
    const loggedIn = props.loggedIn;
    const userRole = props.userRole;
    const userId = props.userId;

    return (
        <>
            {/* Farmer home page */}
            <Route path="/farmer">
                { 
                loggedIn && userRole === "farmer" ? 
                    <div userRole={userRole} userId={userId}/>
                :
                    <RedirectUser userRole={userRole}/>
                }
            </Route>
        </>
    );
}

export default RoutesFarmer;
