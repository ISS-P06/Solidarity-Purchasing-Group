import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { Eyeglasses } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

function OrderItem(props) {
  return (
    <Card className="shadow">
      
      <Card.Header  className="pb-0">
        <Container>
        <Row>
          {/*<Col xs={{ span: 3 }}><div className="border border-primary rounded-pill">status</div></Col>*/}
          <Col xs={{ offset: 11, span: 1 }}><h5 className="ml-auto"><strong>#{props.order.orderId}</strong></h5></Col>
        </Row>
        </Container>
      </Card.Header>
      <Card.Body>
        <Row>Owner: {props.order.email}</Row>
        <Link
          to={{
            pathname: `/employee/orders/${props.order.orderId}`,
          }}>
          <Button className="btn">
            <Eyeglasses /> Read more
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
}

export default OrderItem;
