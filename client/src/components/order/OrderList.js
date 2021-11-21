import OrderItem from './OrderItem';
import { useEffect, useState } from 'react';
import api_getOrders from '../../Api';
import { Container, Row, Col } from 'react-bootstrap/';

function OrderList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api_getOrders()
      .then((orders) => {
        setOrders(orders);
      })
      .catch((e) => console.log(e));
  }, [setOrders]);

  const orderList = orders.map((order) => (
    <div key={order.orderId.toString()} className="pb-3">
      <OrderItem key={order.orderId.toString()} order={order} />
    </div>
  ));

  return (
    <div>
      <div className="pt-4 pb-3">
        <h3>Orders</h3>
      </div>
      <Container className="OrderList">
        <Row className="justify-content-md-center">
          <Col lg={8} className="pl-5 pb-4">
            {orderList}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default OrderList;
