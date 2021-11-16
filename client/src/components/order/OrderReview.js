import { Card,  Button, Row, Col } from 'react-bootstrap';
import { BoxArrowInUp } from 'react-bootstrap-icons';
import OrderTable from './OrderTable';

import { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import './OrderReview.css';

import { api_getOrderReview, api_doDelivery } from '../../Api';

function OrderReview() {
  const [orderReview, setOrderReview] = useState(0, '', [], '');
  const [isUpdated, setIsUpdated] = useState(false);

  let match = useRouteMatch('/employee/orders/:id');

  useEffect(() => {
    if (!isUpdated)
      api_getOrderReview(match.params.id)
        .then((order) => {
          setOrderReview(order);
          setIsUpdated(true);
        })
        .catch((e) => console.log(e));
  }, [match]);

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
    <div calssName="OrderReview">
      <div className="Title">
        <h3>Order Review</h3>
      </div>
      <Row className="justify-content-md-center">
          <Col lg={8} className="pl-5">
            <Card>
              <Card.Header>ID: #{orderReview.orderId}</Card.Header>
              <Card.Body>
                {' '}
                <div className="Owner">Owner: {orderReview.email} </div> <br /> <br />
                <OrderTable products={orderReview.products} />
                State: {orderReview.status} <br />
                <br />
                {orderReview.status!=="delivered"?
                  <Button className="btn" onClick={doDelivery}>
                  <BoxArrowInUp /> Deliver
                </Button> : <></>
                }
              </Card.Body>
            </Card>
          </Col>
        </Row>
    </div>
  );
}

export default OrderReview;
