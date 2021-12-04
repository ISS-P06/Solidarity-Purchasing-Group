import OrderItem from './OrderItem';
import {useEffect, useState} from 'react';
import {api_getOrders, api_getClientOrders} from '../../Api';
import {Container, Row, Col, Spinner} from 'react-bootstrap/';
import {addMessage} from '../Message';

function OrderList(props) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (props.userRole === 'shop_employee') {
            api_getOrders()
                .then((orders) => {
                    setOrders(orders);
                    setLoading(false);
                })
                .catch((e) => {
                    addMessage({title: "Error", message: e.message, type: 'danger'})
                    setLoading(false);
                });
        } else if (props.userRole === 'client') {
            api_getClientOrders(props.userId)
                .then((orders) => {
                    setOrders(orders);
                    setLoading(false);
                })
                .catch((e) => {
                    addMessage({title: "Error", message: e.message, type: 'danger'})
                    setLoading(false);
                });
        }
    }, [setOrders]);

    const orderList = orders.map((order) => (
        <div key={order.orderId.toString()} className="pb-3">
            <OrderItem key={order.orderId.toString()} order={order} userRole={props.userRole} userId={props.userId}/>
        </div>
    ));

    return (
        loading ? (
            <Spinner animation="border" variant="success"/>
        ) : (
            <div>
                <div className="pt-4 pb-3">
                    <h3>Orders</h3>
                </div>
                <Container className="OrderList">
                    <Row className="justify-content-md-center">
                        <Col lg={8} className="pl-5 pb-4">
                            {orders.length === 0 ? <h5>No orders found </h5> : orderList}
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    );
}

export default OrderList;
