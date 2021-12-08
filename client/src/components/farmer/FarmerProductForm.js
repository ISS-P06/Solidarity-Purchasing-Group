import { Button, Container, Row, Col, Form, FloatingLabel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {api_insertProductDescription} from '../../Api'
import {addMessage} from "../Message";


const FarmerProductForm = (props) => {
    const { userId } = props;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Bread');
    const [unit, setUnit] = useState('kg');
    const [validated, setValidated] = useState(false);


    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;

        if (!form.checkValidity()) {
            setValidated(true);
        } else {
            const newProduct = { name: name, description: description, category: category, unit: unit, ref_farmer: userId };
            api_insertProductDescription(newProduct)
                .then(()=>{
                    addMessage({message: 'New product description added successfully', type: 'success'});
                }).catch((err)=>{
                addMessage({message: 'There has been an error with adding new description', type: 'danger'});
            })
            // TODO: call api to add product in the db


            setValidated(true);
        }

    }

    return <Container>
        <Row>
            <Col xs={{ offset: 2, span: 8 }} lg={{ offset: 3, span: 6 }} className="p-0">
                <div className="pt-2 pb-4">
                    <h3>Add new product</h3>
                </div>
                <Form aria-labelledby="newProduct" noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                        <FloatingLabel controlId="newProduct" label="Name">
                            <Form.Control required value={name} onChange={(ev) => setName(ev.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                Please provide a name
                            </Form.Control.Feedback>
                        </FloatingLabel>

                    </Form.Group>
                    <Form.Group className="mb-4">
                        <FloatingLabel controlId="newProduct" label="Description">
                            <Form.Control as="textarea" style={{ height: '120px' }}
                                value={description} onChange={(ev) => setDescription(ev.target.value)} required />
                            <Form.Control.Feedback type="invalid">
                                Please provide a description
                            </Form.Control.Feedback>
                        </FloatingLabel>
                    </Form.Group>
                    <Container className="p-0">
                        <Row>
                            <Col sm={{ span: 5 }}>
                                <Form.Group>
                                    <FloatingLabel controlId="newProduct" label="Category">
                                        <Form.Select value={category} onChange={(ev) => setCategory(ev.target.value)} >
                                            <option value="Bread">Bread</option>
                                            <option value="Dairy Products">Dairy products</option>
                                            <option value="Food items">Food items</option>
                                            <option value="Fruits and Vegetables">Fruits and vegetables</option>
                                            <option value="Meats cold cuts">Meats cold cuts</option>
                                            <option value="Pasta and Rice">Pasta and rice</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                            <Col sm={{ offset: 2, span: 5 }}>
                                <Form.Group className="mb-4">
                                    <FloatingLabel controlId="newProduct" label="Unit">
                                        <Form.Select value={unit} onChange={(ev) => setUnit(ev.target.value)} >
                                            <option value="kg">Kg</option>
                                            <option value="lt">Litre</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Container>

                    <Container className="p-0 mt-3">
                        <Row>
                            <Col xs={{ offset: 0, span: 2 }} className="d-flex flex-row">
                                <Link to="/farmer/products">
                                    <Button>Back</Button>
                                </Link>
                            </Col>
                            <Col xs={{ offset: 8, span: 2 }} className="d-flex flex-row-reverse">
                                <Button type="submit">Add</Button>
                            </Col>
                        </Row>
                    </Container>
                </Form>
            </Col>
        </Row>
    </Container>;
}

export default FarmerProductForm;
