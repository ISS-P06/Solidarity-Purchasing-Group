import { Route, Redirect } from 'react-router-dom';
import RedirectUser from './RedirectUser'; 

import {
    ClientsList,
    InsertClient,
    OrderList,
    OrderReview,
    ProductCards
} from '../.';

import { checkOrderInterval } from '../../utils/date';

function RoutesEmployee(props) {
    const loggedIn = props.loggedIn;
    const userRole = props.userRole;
    const setMessage = props.setMessage;
    const userId = props.userId;
    const virtualTime = props.virtualTime;
    const dirtyVT = props.dirtyVT;

    return (
        <>
            {/* Employee: client info page route */}
            <Route
                path="/employee/clients/:id"
                render={({ match }) => {
                if (loggedIn) {
                    return <div id={match.params.id} />;
                } else {
                    return <RedirectUser userRole={userRole} />;
                }
                }}
            />

            {/* Employee client list route */}
            <Route path="/employee/clients">
                {loggedIn && userRole === 'shop_employee' ? (
                <ClientsList 
                    setMessage={setMessage} 
                    virtualTime={virtualTime} />
                ) : (
                <RedirectUser userRole={userRole} />
                )}
            </Route>

            {/* Employee client registration route */}
            <Route path="/employee/register">
                {loggedIn && userRole === 'shop_employee' ? (
                <InsertClient />
                ) : (
                <RedirectUser userRole={userRole} />
                )}
            </Route>

            {/* Employee product browsing route */}
            <Route path="/employee/products">
                {loggedIn && userRole == 'shop_employee' ? (
                <ProductCards userRole={userRole} userId={userId} />
                ) : (
                <RedirectUser userRole={userRole} />
                )}
            </Route>

            {/* Employee: order info page route */}
            <Route path="/employee/orders/:id">
                {loggedIn ? <OrderReview userRole={userRole}/> : <RedirectUser userRole={userRole} />}
            </Route>            

            {/* 
                Employee order creation route 
                Orders can only be made within a set time interval
            */}
            <Route path="/employee/orders/new">
                {
                    dirtyVT ?
                        <div>
                            Please wait...
                        </div>
                        :
                        <>
                            {loggedIn && userRole === 'shop_employee' && checkOrderInterval(virtualTime) ? (
                                <div/>
                                ) : (
                                <Redirect to='/employee/orders'/>
                            )}
                        </>
                }
            </Route>

            {/* Employee order list route */}
            <Route path="/employee/orders">
                {loggedIn && userRole === 'shop_employee' ? (
                <OrderList userRole={userRole} userId={userId}/>
                ) : (
                <RedirectUser userRole={userRole} />
                )}
            </Route>

            {/* Employee home page route */}
            <Route path="/employee">
                {loggedIn && userRole === 'shop_employee' ? (
                <div />
                ) : (
                <RedirectUser userRole={userRole} />
                )}
            </Route>
        </>
    );
}

export default RoutesEmployee;
