import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { BoxArrowInUp } from 'react-bootstrap-icons';
import OrderTable from './OrderTable';

import { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';

import { api_getOrderReview, api_doDelivery } from '../../Api';

function OrderReview(props) {
  const [orderReview, setOrderReview] = useState(0, '', [], '');
  const [isUpdated, setIsUpdated] = useState(false);

  const match = useRouteMatch('/employee/orders/:id');

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
    <div>
      <div className="pt-4 pb-3">
        <h3>Order review</h3>
      </div>
      <Row className="justify-content-md-center">
        <Col lg={8} className="pl-5">
          <Card className="shadow">
            <Card.Header>
              <Container className="pr-0">
                <Row>
                  {/*<Col xs={{ span: 3 }}><div className="border border-primary rounded-pill">status</div></Col>*/}
                  <Col xs={{ offset: 11, span: 1 }} className="p-0">
                    <h5 className="ml-auto  mb-0" style={{ textAlign: 'right' }}>
                      <strong>#{orderReview.orderId}</strong>
                    </h5>
                  </Col>
                </Row>
              </Container>

            </Card.Header>
            <Card.Body>
              <div className="Owner">Owner: {orderReview.email} </div> <br /> <br />
              <OrderTable products={orderReview.products} />
              State: {orderReview.status} <br />
              <br />
              {orderReview.status !== 'delivered' ? (
                props.userRole==="shop_employee" && <Button className="btn" onClick={doDelivery}>
                  <BoxArrowInUp /> Deliver
                </Button>
              ) : (
                <></>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default OrderReview;
