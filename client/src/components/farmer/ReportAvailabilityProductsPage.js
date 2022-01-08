import { Button, Form, Col, FloatingLabel, Row, Container, Table, Spinner } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { api_getFarmerProducts, api_addAvailableProductQuantity, api_getSupplyFarmerProducts, api_removeAvailableProductQuantity } from '../../Api';
import { addMessage } from '../Message';
import { checkSupplyInterval } from '../../utils/date';
import FarmerProductForm from './FarmerProductForm';
function ReportAvailabilityProductsPage(props) {
    const { user } = props;
    const [productsList, setProductsList] = useState([]); /* list of farmer's products */
    const [suppliedProducts, setSuppliedProducts] = useState([]); /* list of products supplied the next week */
    const [dirty, setDirty] = useState(false) /* used to reaload the list  of products supplied the next week */
    const [loading, setLoading] = useState(true); /* used for visualize the spinner  */
    const [farmerProductFormShow, setFarmerProductFormShow] = useState(false); /* used for opening farmerProductFormShow modal*/

    useEffect(() => {
        api_getFarmerProducts(user.id)
            .then((products) => {
                setProductsList(products);
            })
            .catch((e) => addMessage({ message: e.message, type: 'danger' }));

    }, []);

    useEffect(() => {
        api_getSupplyFarmerProducts(props.user.id)
            .then((products) => {
                setSuppliedProducts(products.slice(-10)); /*To update */
                setDirty(false)
                setLoading(false);
            })
            .catch((e) => addMessage({ message: e.message, type: 'danger' }));
    }, [dirty, props.virtualTime]);

    return (
        <Container>
            <Row className="justify-content-center">
                <Col lg={8} className="pl-5">
                    <h3 className={"mb-3"}>Your expected available product amounts for the next week</h3>
                    {loading ? <Spinner animation="border" variant="success" /> :
                        <SuppliedProducts suppliedProducts={suppliedProducts} setDirty={setDirty} ></SuppliedProducts>}
                    <h3 className={"mb-3 mt-5"}>Add product amounts for the next week</h3>

                    <SuppliedProductForm productsList={productsList} setDirty={setDirty} virtualTime={props.virtualTime} />

                    <Row className={"justify-content-center"}>
                        <Col xs={6} md={3}>
                            <Button onClick={()=>setFarmerProductFormShow(true)}>Add new product</Button>
                        </Col>

                    </Row>
                </Col>
            </Row>
            <FarmerProductForm
                user={user}
                show={farmerProductFormShow}
                handleClose={() => setFarmerProductFormShow(false)}
            />
        </Container>
    );
}

export function SuppliedProducts(props) {
    const { suppliedProducts, setDirty } = props;

    const removeAvailableProductQuantity = (productID) => {
        api_removeAvailableProductQuantity(productID)
            .then(() => {
                setDirty(true);
                addMessage({ message: 'Report available product remove with success ', type: 'success' });
            }).catch((err) => {
                addMessage({ message: err.message, type: 'danger' });
            });
    }
    return (
        <Table striped bordered hover responsive size="sm">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {suppliedProducts.length > 0 && suppliedProducts.map((product, index) =>

                    <tr key={suppliedProducts[index].id}>
                        <td>{suppliedProducts[index].name}</td>
                        <td>{suppliedProducts[index].quantity} {suppliedProducts[index].unit}</td>
                        <td>{suppliedProducts[index].price} € /{suppliedProducts[index].unit}</td>
                        <td><Button className="btn-danger" onClick={() => removeAvailableProductQuantity(Number(suppliedProducts[index].id))}>Remove</Button></td>
                    </tr>

                )}
            </tbody>
        </Table>
    )
}

export function SuppliedProductForm(props) {
    const {
        productsList,
        setDirty
    } = props;

    const [validated, setValidated] = useState(false); /* used for the validation of the form */
    const [productID, setProductID] = useState(); /* current product id */
    const [expectedQuantityAvailable, setExpectedQuantityAvailable] = useState(); /* expected quantity available for the next week  */
    const [price, setPrice] = useState(); /* price of the product for unit */

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity() === true) {
            const supplyProduct = { productID: Number(productID), quantity: Number(expectedQuantityAvailable).toFixed(2), price: Number(price).toFixed(2) }

            api_addAvailableProductQuantity(supplyProduct)
                .then(() => {
                    setDirty(true)
                    addMessage({ message: 'Report available product added with success ', type: 'success' });
                }).catch((err) => {
                    addMessage({ message: err.message, type: 'danger' });
                });
            setValidated(false);
        } else {
            setValidated(true);
        }
    };


    return (

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
                <Col xs={12} lg={4}>
                    <FloatingLabel controlId="ProductName" label="Name of the product" className="mt-2">
                        {checkSupplyInterval(props.virtualTime) ? (
                            <Form.Select
                                aria-label="Name of the product"
                                onChange={(e) => setProductID(e.target.value)} required>
                                <option></option>
                                {productsList && productsList.map((p, k) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}

                            </Form.Select>
                        ) : (
                            <Form.Select
                                disabled
                                aria-label="Name of the product"
                                onChange={(e) => setProductID(e.target.value)} required>
                                <option></option>
                                {productsList && productsList.map((p, k) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}

                            </Form.Select>
                        )}

                        <Form.Control.Feedback type="invalid">
                            Please insert the category of the product
                        </Form.Control.Feedback>
                    </FloatingLabel>
                </Col>

                <Col xs={12} lg={4}>
                    <FloatingLabel
                        controlId="ProductQuantity"
                        label={`Product quantity${productsList.length > 0 && productID ? '(' + productsList.find((product) => product.id == productID).unit + ')' : ""}`}
                        className="mt-2"
                        required
                        onChange={(e) => setExpectedQuantityAvailable(Number(e.target.value))}>
                        {checkSupplyInterval(props.virtualTime) ? (
                            <Form.Control
                            type="number"
                            placeholder="number"
                            step="0.5"
                            min={0.5}
                            max={1000}
                            required
                        />
                        ): (
                            <Form.Control
                            type="number"
                            placeholder="number"
                            step="0.5"
                            min={0.5}
                            max={1000}
                            required
                            disabled
                        />
                        )}
                        
                        <Form.Control.Feedback type="invalid">
                            Please insert a quantity between 0.1 e 1000
                        </Form.Control.Feedback>
                    </FloatingLabel>
                </Col>

                <Col xs={12} lg={4}>
                    <FloatingLabel
                        controlId="Price"
                        label={`Price${productsList.length > 0 && productID ? '/' + productsList.find((product) => product.id == productID).unit : ""}`}
                        className="mt-2"
                        required
                        onChange={(e) => setPrice(Number(e.target.value))}>

                        {checkSupplyInterval(props.virtualTime) ? (
                            <Form.Control
                            type="number"
                            placeholder="number"
                            step="0.1"

                            min={0.1}
                            max={1000}
                            required
                        />
                        ): (
                            <Form.Control
                            type="number"
                            placeholder="number"
                            step="0.1"

                            min={0.1}
                            max={1000}
                            required
                            disabled
                        />
                        )}
                        
                        <Form.Control.Feedback type="invalid">
                            Please insert a price between 0.1 e 1000
                        </Form.Control.Feedback>
                    </FloatingLabel>
                </Col>
            </Row>
            {checkSupplyInterval(props.virtualTime) ? (
                <Row className={"justify-content-center"}>
                    <Col xs={6} lg={9}>
                        <Button type="submit" variant="primary" className="mt-3 mb-3"> Add product available amounts </Button>
                    </Col>
                </Row>
            ) : (
                <Row className={"justify-content-center"}>
                    <Col xs={6} lg={9}>
                        <Button type="submit" variant="primary" className="mt-3 mb-3" disabled> Add product available amounts </Button>
                        <h5>Sorry but you can insert available products only from Wed. to Sat. 9 am</h5>
                    </Col>
                </Row>
            )}

        </Form>
    );
}



export default ReportAvailabilityProductsPage;
