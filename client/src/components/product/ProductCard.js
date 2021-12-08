import { Row, Col, Card, ListGroup, Button, Modal, Image, Form, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { checkOrderInterval } from '../../utils/date';

const ProductCard = (props) => {
    const { product, userRole, onBasketAdd, virtualTime } = props;

    const regex = /[ _]/g;
    let imgName = product.category.replace(regex, '-').toLowerCase() + '-16x11.png';
    let imgPath = '/img/products/' + imgName;

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        setReservedQuantity(0)
    };
    const handleShow = () => setShow(true);

    const [reservedQuantity, setReservedQuantity] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    
    /**
     * This function handles what happen if we add a product in the basket,
     *  performing some checks on the quantity, at the end recall a fuction that add the product on the basket
     * 
     */
    const handleAddProductToBasket = async () => {
        if (reservedQuantity < 0.1) {
            setErrorMessage('You cannot add less than 0.1 Kg');
            return;
        }
        if (reservedQuantity > product.quantity) {
            setErrorMessage('You cannot add more than the available quantity');
            return;
        }
        onBasketAdd(reservedQuantity, product.id);
        setShow(false);
    }

    return (
        <Col sm={{ span: 6 }} md={{ span: 6 }} lg={{ span: 3 }} className="mb-3">
            <Card bg="light" text="black" className="shadow">
                <Card.Img variant="top" src={imgPath} />
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <Card.Body className="p-0">
                            <Card.Title>{product.name}</Card.Title>
                            {userRole !== "farmer" && <Card.Text>{product.farm_name}</Card.Text>}
                            {userRole === "farmer" && <Card.Text>{product.description}</Card.Text>}
                        </Card.Body>
                    </ListGroup.Item>
                    {userRole === "farmer" && <ListGroup.Item>Unit: {product.unit}</ListGroup.Item>}
                    {userRole !== "farmer" && (<>
                        <ListGroup.Item>
                            Price: {product.price} €/{product.unit}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Quantity: {product.quantity} {product.unit}
                        </ListGroup.Item>
                    </>)}
                </ListGroup>
                {userRole == "client" ?
                    <Card.Footer>
                        {checkOrderInterval(virtualTime) ? (
                            <Button
                                variant="primary"
                                className="float-end text-light pt-0 pb-1"
                                style={{ fontSize: 20 }}
                                onClick={handleShow}>
                                +
                            </Button>) : (
                            <Button
                                variant="primary"
                                className="float-end text-light pt-0 pb-1"
                                style={{ fontSize: 20 }}
                                onClick={handleShow} disabled>
                                +
                            </Button>
                        )
                        }
                        <Modal show={show} onHide={handleClose} centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Please insert the quantity</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Row>
                                    <Col>
                                        <Image src={imgPath} fluid rounded />
                                    </Col>
                                    <Col xs={2}>
                                        {product.name}
                                    </Col>
                                    <Col xs={6}>
                                        <Form.Control
                                            type="text"
                                            placeholder="Insert Quantity"
                                            onChange={(e) => setReservedQuantity(e.target.value)}
                                        />
                                    </Col>
                                    <Col xs={1}>
                                        {product.unit}
                                    </Col>
                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <Row>
                                    <Col style={{ left: '10%' }}>
                                        <h5> Total € {(reservedQuantity * product.price).toFixed(2)}</h5>
                                    </Col>
                                    <Col>
                                        <Button variant="primary"
                                        onClick={handleAddProductToBasket}
                                        disabled={!checkOrderInterval(virtualTime)}>
                                            Add product to Basket
                                        </Button>
                                    </Col>
                                </Row>
                            </Modal.Footer>
                            { errorMessage && <Alert variant="danger">{errorMessage}</Alert> }
                        </Modal>
                    </Card.Footer> : <></>}
            </Card>
        </Col>
    );
};

export default ProductCard;