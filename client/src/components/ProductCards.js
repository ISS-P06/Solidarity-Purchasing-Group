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
    Alert,
    Spinner
} from 'react-bootstrap';

import { useState, useEffect } from 'react';
import { api_getProducts, api_addProductToBasket } from '../Api';
import { addMessage } from './Message';
import { checkOrderInterval } from '../utils/date'

const ProductCards = (props) => {
    // product code
    // product: { id, name, description, category, quantity, price, unit, ref_farmer, farm_name }
    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api_getProducts()
            .then((products) => {
                setProductList(products);
                setLoading(false);
            })
            .catch((e) => {
                addMessage({ message: e.message, type: 'danger' })
                setLoading(false);
            });
    }, [props.virtualTime]);

    // pagination code
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);
    const [error, setError] = useState("")
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    const [searchedProduct, setSearchedProduct] = useState([]);
    const [searchText, setSearchText] = useState('');

    const indexOfLastProduct = currentPage * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = searchText.length > 0 ?
        searchedProduct.slice(indexOfFirstProduct, indexOfLastProduct) :
        productList.slice(indexOfFirstProduct, indexOfLastProduct)
    const pageNumbers = [];

    /**
     * The function handleOnSerachProduct take an argument that is the name of the product that you want to looking for,
     * it creates a regular expression to find if the serach text matches the name of each product.
     * If yes the product is added to the list of the product that we want to show.
     * If there are no product with name specified as parameter is set an error that informs you.
     *
     * @param {string} text
     * - text is the product name string you want to looking for.
     */
    const handleOnSearchProduct = (text) => {
        let products = [];
        setSearchText(text);
        var searchExpr = new RegExp('^' + text, 'i');

        productList.forEach((product) => {

            if (searchExpr.test(product.name))
                products.push(product);

        });

        if (products.length === 0 && text.length > 0) {
            setError("Sorry there are no products with name " + text);
        } else {
            setError('');
        }
        setSearchedProduct(products);
        setCurrentPage(1);
    }

    let endPage = searchText.length > 0 ?
        Math.ceil(searchedProduct.length / productsPerPage) :
        Math.ceil(productList.length / productsPerPage)
    let startPage = currentPage - 2;
    if (startPage < 1)
        startPage = 1;
    if (startPage > endPage - 4)
        startPage = endPage - 4;

    for (let i = startPage; i <= startPage + 4; i++) {
        if (i > 0)
            pageNumbers.push(i);
    }

    /**
     * This function calls the api of reference to add product on the basket
     * @param {*} reservedQuantity 
     *  - The quantity to add in the basket
     * @param {*} productId 
     *  - The id of the product we wnat to add
     */

    const handleAddProductToBasket = async (reservedQuantity, productId) => {
        await api_addProductToBasket(props.userId, productId, reservedQuantity).then(() => {
            props.handleAddProduct();
            addMessage({ message: 'Product correctly added to the basket', type: "info" });

        }).catch((e) => addMessage({ message: e.message, type: 'danger' }));

    }

    return (

        loading ? (
            <Spinner animation="border" variant="success" className={"mt-3"} />
        ) : (
            <Container style={{ textAlign: 'left' }}>
                <Row className="mt-4">
                    <Col style={{ display: 'flex', justifyContent: 'center' }}>
                        <h3>Browse products</h3>
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col style={{ display: 'flex', justifyContent: 'center' }}>
                        <Form>
                            <Form.Control
                                type="text"
                                placeholder="Search Product"
                                onChange={(e) => handleOnSearchProduct(e.target.value)} />
                        </Form>
                    </Col>
                </Row>
                <Row className="mt-4">
                    {productList.length === 0 && (
                        <Col style={{ display: 'flex', justifyContent: 'center' }}>
                            <h5>No products found</h5>
                        </Col>
                    )}
                    {error && (
                        <Col style={{ display: 'flex', justifyContent: 'center' }}>
                            <h5>{error}</h5>
                        </Col>
                    )}
                    {currentProducts.map((p) => {
                        return <ProductCard key={p.id} product={p} userRole={props.userRole}
                            onBasketAdd={handleAddProductToBasket} virtualTime={props.virtualTime}/>;
                    })}
                </Row>
                {!error && (<Row className="mt-3 mb-3">
                    <Col style={{ display: 'flex', justifyContent: 'center' }}>
                        {productList.length !== 0 &&
                            <Pagination size="md">
                                {currentPage !== 1 && <Pagination.First onClick={() => setCurrentPage(1)} />}
                                {currentPage !== 1 && <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} />}
                                {pageNumbers.map((i) => (
                                    <Pagination.Item key={i} active={currentPage === i} onClick={() => setCurrentPage(i)}>
                                        {i}
                                    </Pagination.Item>
                                ))}
                                {currentPage !== endPage &&
                                    <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} />}
                                {currentPage !== endPage && <Pagination.Last onClick={() => setCurrentPage(endPage)} />}
                            </Pagination>
                        }
                    </Col>
                </Row>)}
            </Container>
        )

    );
};

const ProductCard = (props) => {
    const { product } = props;
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

        if (reservedQuantity > props.product.quantity) {
            setErrorMessage('You cannot add more than the available quantity');
            return;
        }

        props.onBasketAdd(reservedQuantity, props.product.id);
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
                            <Card.Text>{product.farm_name}</Card.Text>
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
                        { checkOrderInterval(props.virtualTime) ? (
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
                                        {
                                            checkOrderInterval(props.virtualTime) ? (
                                                <Button variant="primary" onClick={handleAddProductToBasket}>
                                                    Add product to Basket
                                                </Button>) : (
                                                <Button variant="primary" onClick={handleAddProductToBasket} disabled>
                                                    Add product to Basket
                                                </Button>)
                                        }
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
