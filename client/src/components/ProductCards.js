import { Container, Row, Col, Card, Button, ListGroup, Pagination } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const ProductCards = (props) => {
    const { productList } = props;
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [currentPage])

    // pagination code
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = productList.slice(indexOfFirstProduct, indexOfLastProduct);
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(productList.length / productsPerPage); i++) {
        pageNumbers.push(i);
    }

    const changePage = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    return <Container style={{ textAlign: "left" }}>
        <Row className="mt-3">
            {
                currentProducts.map((p) => {
                    return <ProductCard key={p.id} product={p} />
                })
            }
        </Row>
        <Row>
            <Col style={{ display: "flex", justifyContent: "center" }}>
                <Pagination size="md">
                    {pageNumbers.map(i => (
                        <Pagination.Item key={i} active={currentPage === i} onClick={() => changePage(i)}>{i}</Pagination.Item>
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

    return <Col xs={{ span: 6 }} sm={{ span: 6 }} md={{ span: 4 }} lg={{ span: 3 }} className="mb-3">
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
