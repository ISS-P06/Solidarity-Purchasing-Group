import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';


/**
 * This component display a a breaf summury of an order
 * @param {*} props: {order}
 *  - order: custom object representing an order {id, date, email}
 *    - id: order id
 *    - date: order date
 *    - email: owner email (email that belongs to the user)
 */
function OrderItem(props) {

    let link;
    if (props.userRole === 'shop_employee') {
        link = `/employee/orders/${props.order.orderId}`;
    } else if (props.userRole === 'client') {
        link = `/client/orders/${props.order.orderId}`;
    }

    return (
        <Card className="shadow">
            <Card.Header className="pt-1 pb-2">
                <h5 className="pt-2">
                    Order number: <strong>{props.order.orderId}</strong>
                </h5>
            </Card.Header>
            <Card.Body>
                <Container>
                    <Row>
                        <Col>Date: {props.order.date}</Col>
                    </Row>
                    <Row>
                        <Col>Email: {props.order.email}</Col>
                    </Row>
                    <Row>
                        <Col className="pt-4 pb-3">
                            <span className="border border-success rounded-pill p-2">{props.order.status}</span>
                        </Col>
                    </Row>
                </Container>
            </Card.Body>
            <Card.Footer>
                <Row>

                    <Col>
                        <Link to={{ pathname: link, }}>
                            <Button variant="primary" className="float-end text-light m-0 pt-1 pb-1" style={{ fontSize: 16 }}>Read more</Button>
                        </Link>
                    </Col>
                </Row>
            </Card.Footer>
        </Card>
    );
}

export default OrderItem;