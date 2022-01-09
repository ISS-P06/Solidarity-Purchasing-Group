import OrderItem from './OrderItem';
import {useEffect, useState} from 'react';
import {api_getOrders, api_getClientOrders} from '../../Api';
import {Container, Row, Col, Spinner, FloatingLabel, Form} from 'react-bootstrap';
import {addMessage} from '../Message';

/**
 * This component shows the list of order relative:
 *  - an user if we log as user
 *  - all orders if we log as shop_employee
 * 
 * @param {*} props: {userRole, userId}
 *  - userRole
 *  - userId
 * @returns 
 */
function OrderList(props) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [typeOrders,setTypeOrders]=useState("all"); //type of orders visualized
    const [ordersVisualized, setOrdersVisualized]=useState([]); //listed of orders visualized according the type of orders selected

    useEffect(() => {
        if (props.userRole === 'shop_employee') {
            api_getOrders()
                .then((list) => {
                    setOrders(list);
                    setLoading(false);
                })
                .catch((e) => {
                    addMessage({title: "Error", message: e.message, type: 'danger'})
                    setLoading(false);
                });
        } else if (props.userRole === 'client') {
            api_getClientOrders(props.userId)
                .then((list) => {
                    setOrders(list);
                    setOrdersVisualized(list);
                    setLoading(false);
                })
                .catch((e) => {
                    addMessage({title: "Error", message: e.message, type: 'danger'})
                    setLoading(false);
                });
        }
        // eslint-disable-next-line
    }, [setOrders, props.virtualTime]);

    useEffect(() => {
        if(typeOrders==="all"){
            setOrdersVisualized(orders);
        }
        else{
            setOrdersVisualized(orders.filter((order)=> order.status===typeOrders));
        }

    }, [typeOrders, orders]);

    const orderList = ordersVisualized.map((order) => (
        <div key={order.orderId.toString()} className="pb-3">
            <OrderItem key={order.orderId.toString()} order={order} userRole={props.userRole} userId={props.userId} virtualTime={props.virtualTime}/>
        </div>
    ));

    const PageView = () => (
        <div>
            <div className="pt-4 pb-3">
                <h3>Orders</h3>
            </div>

            <Container className="OrderList">
                <Row className="justify-content-md-center">
                    <Col lg={8} className="pl-5 pb-4">
                        {props.userRole === 'shop_employee' && (
                            <Row className="justify-content-end mb-3 ">
                                <Col xs={12} md={8} lg={4}>
                                    <FloatingLabel controlId="TypeOrders" label="Visualize orders by">
                                        <Form.Select aria-label="Visualize order by" default={typeOrders} onChange={(e) => setTypeOrders(e.target.value)}>
                                            <option value="all">All orders</option>
                                            <option value="pending_canc">Pending cancellation orders </option>
                                            <option value="pending">Pending orders </option>
                                            <option value="confirmed">Confirmed orders</option>
                                            <option value="delivered">Delivered orders</option>
                                            <option value="cancelled">Cancelled orders</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>

                            </Row>)}
                        {orders.length === 0 ? <h5>No orders found </h5> : orderList}
                    </Col>
                </Row>
            </Container>
        </div>
    )

    return (
        loading ? (
            <Spinner animation="border" variant="success"/>
        ) : (
            <PageView/>
        )
    );
}

export default OrderList;
