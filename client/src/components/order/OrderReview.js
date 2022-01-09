import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { BoxArrowInUp } from 'react-bootstrap-icons';
import OrderTable from './OrderTable';
import { addMessage } from '../Message';
import { useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';

import { api_getOrderReview, api_getClientOrderReview, api_doDelivery } from '../../Api';

/**
 * This functional component shows the data relative to each order
 * @param {*} props {userRole}
 *  - User role
 */

function OrderReview(props) {
  const [orderReview, setOrderReview] = useState(0, '', [], '');
  const [isUpdated, setIsUpdated] = useState(false);

  let text, back;
  if (props.userRole === 'shop_employee') {
    text = 'employee';
    back = `/employee/orders/`;
  } else if (props.userRole === 'client') {
    text = 'client';
    back = `/client/orders/`;
  }
  const match = useRouteMatch('/' + text + '/orders/:id');

  useEffect(() => {
    if (!isUpdated) {
      if (props.userRole === 'shop_employee') {
        api_getOrderReview(match.params.id)
          .then((order) => {
            setOrderReview(order);
            setIsUpdated(true);
          })
          .catch((e) => addMessage({ title: 'Error', message: e.message, type: 'danger' }));
      } else if (props.userRole === 'client') {
        api_getClientOrderReview(props.userId, match.params.id)
          .then((order) => {
            console.log(order);
            setOrderReview(order);
            setIsUpdated(true);
          })
          .catch((e) => addMessage({ title: 'Error', message: e.message, type: 'danger' }));
      }
    }
    // eslint-disable-next-line
  }, [match]);


/**
 * doDelivery() handles what happens if we push the button Deliver
 * It calls the reference api to deliver the order
 *   
 */
  const doDelivery = async () => {
    try {
      await api_doDelivery(match.params.id);
      setIsUpdated(false);
      return { done: true, msg: 'ok' };
    } catch (err) {
      return { done: false, msg: err.message };
    }
  };

  return (
    <div>
      <div className="pt-4 pb-3">
        <h3>Order review</h3>
      </div>
      <Row className="justify-content-md-center">
        <Col lg={8} className="pl-5">
          <Card className="shadow">
            <Card.Header className="pt-1 pb-2">
              <h5 className="pt-2">
                Order number:<strong> {orderReview.orderId}</strong>
              </h5>
            </Card.Header>
            <Card.Body>
              <Container>
                <Row>
                  <Col>Date: {orderReview.date}</Col>
                </Row>
                <Row>
                  <Col>Email: {orderReview.email}</Col>
                </Row>
                <Row>
                  <Col>Name: {orderReview.name}</Col>
                </Row>
                <Row>
                  <Col>Surname: {orderReview.surname}</Col>
                </Row>
                <Row>
                  <Col>Phone: {orderReview.phone}</Col>
                </Row>
                {orderReview.delivery &&
                    <Row>
                      <Col>Delivery: {orderReview.delivery.address} {orderReview.delivery.date} {orderReview.delivery.time} </Col>
                    </Row>
                }

              </Container>
              <OrderTable products={orderReview.products} />
              <Container>
                <Row>
                  <Col className="pt-3 pb-3">
                    <span className="border border-success rounded-pill p-2">{orderReview.status}</span>
                  </Col>
                </Row>
              </Container>
            </Card.Body>
            <Card.Footer>
              <Link to={{ pathname: back, }}>
                <Button variant="primary" className="float-start text-light m-0 pt-1 pb-1" style={{ fontSize: 16 }}>
                  Back
                </Button>
              </Link>
              {orderReview.status === 'confirmed' && props.userRole === "shop_employee" && (
                <Button variant="primary" className="float-end text-light m-0 pt-1 pb-1" style={{ fontSize: 16 }} onClick={doDelivery}>
                  <BoxArrowInUp /> Deliver
                </Button>
              )}
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default OrderReview;
