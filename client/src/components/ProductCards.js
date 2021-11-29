import {
    Container,
    Row,
    Col,
    Card,
    ListGroup,
    Pagination,
    Button,
    Modal,
    Image,
    Form,
    Alert
} from 'react-bootstrap';

import {useState, useEffect} from 'react';
import {api_getProducts, api_addProductToBasket} from '../Api';
import { addMessage } from './Message';

const ProductCards = (props) => {
    // product code
    // product: { id, name, description, category, quantity, price, unit }
    const [productList, setProductList] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        api_getProducts()
            .then((products) => {
                setProductList(products);
            })
            .catch(() => setError('Error in getting all the products'));
    }, []);

    // pagination code
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = productList.slice(indexOfFirstProduct, indexOfLastProduct);
    const pageNumbers = [];

    let endPage = Math.ceil(productList.length / productsPerPage);
    let startPage = currentPage - 2;
    if (startPage < 1)
        startPage = 1;
    if (startPage > endPage - 4)
        startPage = endPage - 4;

    for (let i = startPage; i <= startPage + 4; i++) {
        pageNumbers.push(i);
    }

    const handleAddProductToBasket = async (reservedQuantity, productId) => {
        await api_addProductToBasket(props.userId, productId, reservedQuantity).then(() => {
            props.handleAddProduct();
            addMessage({message:'Product correctly added to the basket', type: "info"});

        }).catch((e) => console.log(e));

    }

    return (
        <Container style={{textAlign: 'left'}}>
            <Row className="mt-4">
                <Col style={{display: 'flex', justifyContent: 'center'}}>
                    <h3>Browse products</h3>
                </Col>
            </Row>
            <Row className="mt-4">
                {error && (
                    <Col style={{display: 'flex', justifyContent: 'center'}}>
                        <h4>{error}</h4>
                    </Col>
                )}
                {currentProducts.map((p) => {
                    return <ProductCard key={p.id} product={p} userRole={props.userRole}
                                        onBasketAdd={handleAddProductToBasket}/>;
                })}
            </Row>
            <Row className="mt-3 mb-3">
                <Col style={{display: 'flex', justifyContent: 'center'}}>
                    {productList.length !== 0 &&
                    <Pagination size="md">
                        {currentPage !== 1 && <Pagination.First onClick={() => setCurrentPage(1)}/>}
                        {currentPage !== 1 && <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)}/>}
                        {pageNumbers.map((i) => (
                            <Pagination.Item key={i} active={currentPage === i} onClick={() => setCurrentPage(i)}>
                                {i}
                            </Pagination.Item>
                        ))}
                        {currentPage !== endPage && <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)}/>}
                        {currentPage !== endPage && <Pagination.Last onClick={() => setCurrentPage(endPage)}/>}
                    </Pagination>
                    }
                </Col>
            </Row>
        </Container>
    );
};

const ProductCard = (props) => {
    const {product} = props;
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

    const handleAddProductToBasket = async () => {

        if (reservedQuantity < 0.1) {
            setErrorMessage('You cannot add less than 0.1 Kg');
            return;
        }

        if (reservedQuantity > props.product.quantity) {
            setErrorMessage('You cannot add more than the available quantity');
            return;
        }
        console.log(props.product)

        props.onBasketAdd(reservedQuantity, props.product.id);
        setShow(false);

    }

    return (
        <Col sm={{span: 6}} md={{span: 6}} lg={{span: 3}} className="mb-3">
            <Card bg="light" text="black" className="shadow">
                <Card.Img variant="top" src={imgPath}/>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <Card.Body className="p-0">
                            <Card.Title>{product.name}</Card.Title>
                            <Card.Text>{product.description}</Card.Text>
                        </Card.Body>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        Price: {product.price} €/{product.unit}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        Quantity: {product.quantity} {product.unit}
                    </ListGroup.Item>
                </ListGroup>
                {props.userRole == "client" ?
                    <Card.Footer>
                        <Button
                            variant="primary"
                            className="float-end text-light pt-0 pb-1"
                            style={{fontSize: 20}}
                            onClick={handleShow}>
                            +
                        </Button>
                        <Modal show={show} onHide={handleClose} centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Please insert the quantity</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Row>
                                    <Col>
                                        <Image src={imgPath} fluid rounded/>
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
                                    <Col style={{left: '10%'}}>
                                        <h5> Total € {(reservedQuantity * product.price).toFixed(2)}</h5>
                                    </Col>
                                    <Col>
                                        <Button variant="primary" onClick={handleAddProductToBasket}>
                                            Add product to Basket
                                        </Button>
                                    </Col>
                                </Row>
                            </Modal.Footer>
                            {
                                errorMessage ? <Alert variant="danger">
                                    {errorMessage}
                                </Alert> : <></>
                            }
                        </Modal>
                    </Card.Footer> : <></>}
            </Card>
        </Col>
    );
};

export default ProductCards;
