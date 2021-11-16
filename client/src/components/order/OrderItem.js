import { Card, Button } from 'react-bootstrap';
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
        Owner: {props.order.email}
        <Link
          to={{
            pathname: `/orders/${props.order.orderId}`,
          }}>
          <Button>
            {' '}
            <Eyeglasses /> Read more{' '}
          </Button>{' '}
        </Link>
      </Card.Body>
    </Card>
  );
}

export default OrderItem;
