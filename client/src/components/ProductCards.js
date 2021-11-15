import { Container, Row, Col, Card, Button, ListGroup, Pagination } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { api_getProducts } from '../Api';

const ProductCards = (props) => {

    // product code
    // product: { id, name, description, category, quantity, price, unit }
    const [productList, setProductList] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        api_getProducts()
            .then((products) => {
                setProductList(products);
            })
            .catch(() => setError("Error in getting all the products"));
    }, []);

    // pagination code
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [currentPage])

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = productList.slice(indexOfFirstProduct, indexOfLastProduct);
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(productList.length / productsPerPage); i++) {
        pageNumbers.push(i);
    }

    return <Container style={{ textAlign: "left" }}>
        <Row className="mt-4">
            <Col style={{ display: "flex", justifyContent: "center" }}>
                <h2>Browse products</h2>
            </Col>
        </Row>
        <Row className="mt-4">
            {
                error && <Col style={{ display: "flex", justifyContent: "center" }}><h4>{error}</h4></Col>
            }
            { 
                currentProducts.map((p) => {
                    return <ProductCard key={p.id} product={p} />
                })
            }
        </Row>
        <Row className="mt-3 mb-3">
            <Col style={{ display: "flex", justifyContent: "center" }}>
                <Pagination size="md">
                    {pageNumbers.map(i => (
                        <Pagination.Item key={i} active={currentPage === i} onClick={() => setCurrentPage(i)}>{i}</Pagination.Item>
                    ))}
                </Pagination>
            </Col>
        </Row>
    </Container>;
}

const ProductCard = (props) => {
    const { product } = props;
    const regex = /[ _]/g;
    let imgName = product.category.replace(regex, "-").toLowerCase() + "-16x11.png";
    let imgPath = "/img/products/" + imgName;

    return <Col  sm={{ span: 6 }} md={{ span: 4 }} lg={{ span: 3 }} className="mb-3">
        <Card bg="light" border="secondary" text="black">
            <Card.Img variant="top" src={imgPath} />
            <ListGroup variant="flush">
                <ListGroup.Item>
                    <Card.Body className="p-0">
                        <Card.Title>{product.name}</Card.Title>
                        <Card.Text>{product.description}</Card.Text>
                    </Card.Body>
                </ListGroup.Item>
                <ListGroup.Item>Price: {product.price} €/{product.unit}</ListGroup.Item>
                <ListGroup.Item>Quantity: {product.quantity} {product.unit}</ListGroup.Item>
            </ListGroup>
            <Card.Footer>
                <Button variant="primary" className="float-end text-light pt-0 pb-1" style={{ fontSize: 20 }}>+</Button>
            </Card.Footer>
        </Card>
    </Col>;
}

export default ProductCards;
