import { Card, Button, Row } from 'react-bootstrap';
import { Eyeglasses } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

import './OrderItem.css';

function OrderItem(props) {
  return (
    <Card>
      <Card.Header left>
        {' '}
        <div className="id">ID: #{props.order.orderId} </div>{' '}
      </Card.Header>
      <Card.Body>
        <Row>
          Owner: {props.order.email}
        </Row>


        <Link
          to={{
            pathname: `/employee/orders/${props.order.orderId}`,
          }}>
          <Button className="btn">
            {' '}
            <Eyeglasses /> Read more{' '}
          </Button>{' '}
        </Link>
      </Card.Body>
    </Card>
  );
}

export default OrderItem;
