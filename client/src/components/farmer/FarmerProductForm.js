import { Button, Container, Row, Col, Form } from 'react-bootstrap/';
import { Link } from 'react-router-dom';


const FarmerProductForm = (props) => {
    return <>
        <Container>
            <Row>
                <Col xs={{ offset: 2, span: 8 }} lg={{ offset: 3, span: 6 }} className="p-0">
                    <div className="pt-2 pb-4">
                        <h3>Add new product</h3>
                    </div>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Name</Form.Label>
                            <Form.Control placeholder="Potatoes" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Very natural potatoes!" />
                        </Form.Group>
                        <Container className="p-0">
                            <Row>
                                <Col sm={{ span: 5 }}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Category</Form.Label>
                                        <Form.Select>
                                            <option value="Bread">Bread</option>
                                            <option value="Dairy Products">Dairy products</option>
                                            <option value="Food items">Food items</option>
                                            <option value="Fruits and Vegetables">Fruits and vegetables</option>
                                            <option value="Meats cold cuts">Meats cold cuts</option>
                                            <option value="Pasta and Rice">Pasta and rice</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col sm={{ offset: 2, span: 5 }}>
                                    <Form.Group className="mb-4">
                                        <Form.Label>Unit</Form.Label>
                                        <Form.Select>
                                            <option value="kg">Kg</option>
                                            <option value="lt">Litre</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Container>
                    </Form>
                    <Container className="p-0 mt-3">
                        <Row>
                            <Col xs={{ offset: 0, span: 2 }} className="d-flex flex-row">
                                <Link to="/farmer/products">
                                    <Button>Back</Button>
                                </Link>
                            </Col>
                            <Col xs={{ offset: 8, span: 2 }} className="d-flex flex-row-reverse">
                                <Button>Add</Button>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>
        </Container>

    </>;
}

export default FarmerProductForm;
