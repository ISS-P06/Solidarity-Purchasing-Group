import { Route } from 'react-router-dom';
import RedirectUser from './RedirectUser'; 

import {
    OrderList,
    OrderReview
} from '../.';

function RoutesClient(props) {
    const loggedIn = props.loggedIn;
    const userRole = props.userRole;
    const userId = props.userId;

    return (
        <>
            {/*
                Client page for specific order info
            */}
            <Route path="/client/orders/:id">
                { 
                loggedIn && userRole === "client" ? 
                    <OrderReview userRole={userRole} userId={userId}/>
                :
                    <RedirectUser userRole={userRole}/>
                }
            </Route>

            {/* Client page for list of orders */}
            <Route path="/client/orders">
                { 
                loggedIn && userRole === "client" ? 
                    <OrderList userRole={userRole} userId={userId}/>
                :
                    <RedirectUser userRole={userRole}/>
                }
            </Route>

            {/* Client page for basket */}
            <Route path="/client/basket">
                { 
                loggedIn && userRole === "client" ? 
                    <div userRole={userRole} userId={userId}/>
                :
                    <RedirectUser userRole={userRole}/>
                }
            </Route>

            {/* Client page for list of orders */}
            <Route path="/client/products">
                { 
                loggedIn && userRole === "client" ? 
                    <div userRole={userRole} userId={userId}/>
                :
                    <RedirectUser userRole={userRole}/>
                }
            </Route>

            {/* Client home page */}
            <Route path="/client">
                { 
                loggedIn && userRole === "client" ? 
                    <div userRole={userRole} userId={userId}/>
                :
                    <RedirectUser userRole={userRole}/>
                }
            </Route>
        </>
    );
}

export default RoutesClient;
