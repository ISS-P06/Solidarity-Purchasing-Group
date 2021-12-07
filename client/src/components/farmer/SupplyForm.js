import {Modal, Button, Form, Col, FloatingLabel, Row, Container} from 'react-bootstrap';

import {useState, useEffect} from 'react';
import {api_getFarmerProducts} from '../../Api';
import {addMessage} from '../Message';

function SupplyForm(props) {
    const {user} = props;
    const [productsList, setProductsList] = useState([]); /* list of farmer's product */
    const [supplyProducts, setSupplyProducts] = useState([]); /* list of product supplied for the next week */


    useEffect(() => {
        api_getFarmerProducts(user.id)
            .then((products) => {
                setProductsList(products);
            })
            .catch((e) => addMessage({message: e.message, type: 'danger'}));
    }, []);


    return (
        <Container>
            <Row className="justify-content-center">
                <Col lg={8} className="pl-5">
                    <h3>Report expected available product amounts for the next week</h3>
                    <ProductForm productsList={productsList} supplyProducts={supplyProducts}
                                 setSupplyProducts={setSupplyProducts}/>
                </Col>
            </Row>
        </Container>
    );
}

export function ProductForm(props) {
    const {
        productsList,
        supplyProducts,
        setSupplyProducts
    } = props;

    const [validated, setValidated] = useState(false); /* used for the validation of the form */


    const [productID, setProductID] = useState(); /* current product id */
    const [expectedQuantityAvailable, setExpectedQuantityAvailable] = useState(); /* expected quantity available for the next week  */
    const [price, setPrice] = useState(); /* currentPrice= quantit * price of the product  */

    /*
        const handleSubmit = (event) => {
            const form = event.currentTarget;
            event.preventDefault();
            event.stopPropagation();

            if (form.checkValidity() === true) {
                const supply = {productID: productID, quantity: expectedQuantityAvailable, price: price}
                setSupplyProducts((supplyProducts) => [...supplyProducts, supply]);
                setProductID();
                setExpectedQuantityAvailable();
                setPrice();
                setValidated(false);
            } else {
                setValidated(true);
            }
        };*/


    return (

        <Form noValidate validated={validated}>
            <Row>
                <Col xs={12} lg={4}>
                    <FloatingLabel controlId="ProductName" label="Name of the product" className="mt-2">
                        <Form.Select
                            aria-label="Name of the product"
                            onChange={(e) => setProductID(e.target.value)}>


                            {productsList.map((p, k) => (
                                <option key={p.id} value={p.name}>
                                    {p.name}
                                </option>
                            ))}

                        </Form.Select>
                    </FloatingLabel>
                </Col>

                <Col xs={12} lg={4}>
                    <FloatingLabel
                        controlId="ProductQuantity"
                        label="Product quantity"
                        className="mt-2"
                        required
                        onChange={(e) => setExpectedQuantityAvailable(e.target.value)}>
                        <Form.Control
                            type="number"
                            placeholder="number"
                            step="0.5"
                            defaultValue={expectedQuantityAvailable}
                            min={0.5}
                            max={1000}

                        />
                        <Form.Control.Feedback type="invalid">
                            Please insert a quantity between 0.1 e 1000
                        </Form.Control.Feedback>
                    </FloatingLabel>
                </Col>

                <Col xs={12} lg={4}>
                    <FloatingLabel
                        controlId="Price"
                        label={`Price/${productID[0].unit}`}
                        className="mt-2"
                        required
                        onChange={(e) => setPrice(e.target.value)}>
                        <Form.Control
                            type="number"
                            placeholder="number"
                            step="0.1"
                            defaultValue={expectedQuantityAvailable}
                            min={0.1}
                            max={1000}

                        />
                        <Form.Control.Feedback type="invalid">
                            Please insert a quantity between 0.1 e 1000
                        </Form.Control.Feedback>
                    </FloatingLabel>
                </Col>
            </Row>

            <Row className={"justify-content-end"}>
                <Col xs={6} lg={9}>

                    <Button type="submit" variant="primary" className="mt-3 mb-3"> Add product available </Button>
                </Col>
            </Row>
        </Form>
    );
}

export default SupplyForm;
