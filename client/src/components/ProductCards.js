import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';

const ProductCards = (props) => {
    const { productList } = props;

    return <Container style={{ textAlign: "left" }}>
        <Row className="mt-3">
            {
                productList.map((p) => {
                    return <ProductCard key={p.id} product={p} />
                })
            }
        </Row>
    </Container>;
}

const ProductCard = (props) => {
    const { product } = props;
    const regex = /[ _]/g;
    let imgName = product.category.replace(regex,"-").toLowerCase() + "-16x11.png";
    let imgPath = "/img/products/" + imgName;

    return <Col xs={{ span: 6 }} sm={{ span: 4 }} md={{ span: 3 }}className="mb-3">
        <Card bg="light" border="secondary" text="black">
            <Card.Img variant="top" src={imgPath} />
            <ListGroup variant="flush">
                <ListGroup.Item>
                    <Card.Body className="p-0">
                        <Card.Title>{product.name}</Card.Title>
                        <Card.Text>{product.description}</Card.Text>
                    </Card.Body>
                </ListGroup.Item>
                <ListGroup.Item>Price: {product.price} €/Kg</ListGroup.Item>
                <ListGroup.Item>Quantity: {product.quantity} Kg</ListGroup.Item>
            </ListGroup>
            <Card.Footer>
                <Button variant="success" className="float-end text-light pt-0 pb-1" style={{ fontSize: 20 }}>+</Button>
            </Card.Footer>
        </Card>
    </Col>;
}

export default ProductCards;
