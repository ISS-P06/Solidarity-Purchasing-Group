import {Modal, Button, Form, Col, FloatingLabel, Row} from 'react-bootstrap';

import {useState, useEffect} from 'react';
import {api_getProducts, api_addOrder} from '../../Api';
import {addMessage} from '../Message';
import ScheduleDelivery from "../client/ScheduleDelivery";
function ClientOrderForm(props) {
    const {show, onHide, client, virtualTime, openConfirmationModal} = props;
    const [productsList, setProductsList] = useState([]); /* list of products of available */
    const [categoriesList, setCategoriesList] = useState([]); /* list of the categories */

    const [productsClient, setProductsClient] = useState([]); /* list of the products ordered by the client */
    const [temporaryKey, setTemporaryKey] = useState(0);
    const [partialPrice, setPartialPrice] = useState(0);    /* partial total for the order */
    const [insertProduct, setInsertProduct] = useState(true); //is true when the shop employee is adding a new product
    const [orderID, setOrderID] = useState();

    const [scheduleDeliveryModal, setScheduleDeliveryModal] = useState(false);
    const [askTopUp, setAskTopUp] = useState(false)

    useEffect(() => {
        api_getProducts()
            .then((products) => {
                const distinctCategoriesList = [];
                products
                    .map((p) => p.category)
                    .forEach((c) => {
                        if (!distinctCategoriesList.includes(c)) {
                            distinctCategoriesList.push(c);
                        }
                    });

                setProductsList(products);
                setCategoriesList(distinctCategoriesList);
            })
            .catch((e) => addMessage({message: e.message, type: 'danger'}));
    }, [show]);

    const handleClose = () => {
        onHide();
    };

    const addOrder = async () => {
        if (productsClient.length === 0) {
            addMessage({message: 'Complete add at least one product', type: 'danger'});
        } else if (insertProduct) {
            addMessage({message: 'Complete the addition of the last product', type: 'danger'});
        } else {
          //send the request
          const order = productsClient.map((p) => ({
            id: p.id,
            quantity: p.quantityOrdered,
          }));
          const orderClient = { clientID: client.id, order: order };

          api_addOrder(orderClient)
            .then((id) => {
              addMessage({ message: 'Order ' + id + ' emitted with success ', type: 'success' });
              setOrderID(id);
              handleClose();
              setScheduleDeliveryModal(true);
            })
            .catch((e) => addMessage({ title: 'Error', message: e.message, type: 'danger' }));

          /*RESET*/
          setProductsList([]);
          setProductsClient([]);
          setPartialPrice(0);
          setInsertProduct(true);

            /* verify wallet of the customer */
            if (partialPrice > client.balance) {
                setAskTopUp(true)
            }
        }
    };

    const handleAskTopUp = () =>{
        if(askTopUp){
            openConfirmationModal();
            setAskTopUp(false);
        }
    }

    return (
        <> <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={show}
            onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Add a new client order</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {productsClient
                    ? productsClient.map((product, index) => (
                        <ProductForm
                            key={index}
                            temporaryKey={temporaryKey}
                            setTemporaryKey={setTemporaryKey}
                            setInsertProduct={setInsertProduct}
                            partialPrice={partialPrice}
                            setPartialPrice={setPartialPrice}
                            productsList={productsList}
                            setProductsList={setProductsList}
                            setProductsClient={setProductsClient}
                            categoriesList={categoriesList}
                            product={product}
                        />
                    ))
                    : null}
                <Row className="m-2 justify-content-end">
                    {productsClient.length > 0
                        ? 'Partial total: ' + parseFloat(partialPrice).toFixed(2) + ' €'
                        : ''}
                </Row>

                {insertProduct && productsList ? (
                    <ProductForm
                        temporaryKey={temporaryKey}
                        setTemporaryKey={setTemporaryKey}
                        setInsertProduct={setInsertProduct}
                        partialPrice={partialPrice}
                        setPartialPrice={setPartialPrice}
                        productsList={productsList}
                        setProductsList={setProductsList}
                        setProductsClient={setProductsClient}
                        categoriesList={categoriesList}
                    />
                ) : null}

                {!insertProduct && (
                    <Button
                        className="btn mt-3 mb-3"
                        variant="primary"
                        onClick={() => setInsertProduct(true)}>
                        Add new product
                    </Button>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button className="btn" md="auto" onClick={addOrder}>
                    Add order
                </Button>
                <Button className="btn-danger" variant="danger" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
            <ScheduleDelivery orderID={orderID} show={scheduleDeliveryModal} setShow={setScheduleDeliveryModal} virtualTime={virtualTime} onModalHide={handleAskTopUp} userType={"farmer"}/>
        </>

    );
}

export function ProductForm(props) {
    const {
        temporaryKey,
        setTemporaryKey,
        setInsertProduct,
        partialPrice,
        setPartialPrice,
        productsList,
        setProductsList,
        setProductsClient,
        categoriesList,
        product,
    } = props;
    const [validated, setValidated] = useState(false); /* used for the validation of the form */

    const [currentCategory, setCurrentCategory] = useState(
        product ? product.category : categoriesList[0]
    );
    const [productsListbyCurrentCategory, setProductsListbyCurrentCategory] = useState();

    const [productID, setProductID] = useState(); /* current product id */
    const [quantityOrdered, setQuantityOrdered] = useState(); /* current quantity of the product  */
    const [maxQuantity, setMaxQuantity] = useState(); /* quantity available of the product  */
    const [currentPrice, setCurrentPrice] = useState(); /* currentPrice= quantit * price of the product  */

    useEffect(() => {
        const itemsList = productsList
            .filter((p) => p.category === categoriesList[0])
            .filter((p) => p.quantity > 0);
        setProductsListbyCurrentCategory(itemsList);

        if (product) {
            setProductID(product.id);
            setQuantityOrdered(product.quantityOrdered);
            setMaxQuantity('');
            setCurrentPrice(0);
        }
        else {
            setProductID(itemsList[0] ? itemsList[0].id : ' ');
            setQuantityOrdered(0.1);
            setMaxQuantity(itemsList[0] ? itemsList[0].quantity : ' ');
            setCurrentPrice(itemsList[0] ? itemsList[0].price * 0.1 : ' ');
        }
        // eslint-disable-next-line
    }, []);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity() === true) {
            const productToAdd = {...productsList.find((p) => p.id === productID)};

            if (productToAdd) {
                productToAdd.quantityOrdered = quantityOrdered;
                productToAdd.temporaryKey = temporaryKey;
                setTemporaryKey((tk) => tk + 1);

                setProductsList(
                    productsList.map((p) =>
                        /* update available quantity */
                        p.id === productID ? {...p, quantity: p.quantity - quantityOrdered} : p
                    )
                );

                /* add new product */
                setProductsClient((products) => [...products, productToAdd]);

                /*update total price */

                const addPrice =
                    parseFloat(productToAdd.quantityOrdered).toFixed(2) *
                    parseFloat(productToAdd.price).toFixed(2);
                setPartialPrice(parseFloat(partialPrice) + parseFloat(addPrice));

                setInsertProduct(false);
            }
            setValidated(false);
        } else {
            setValidated(true);
        }
    };

    const updateCurrentCategory = (_category) => {
        setCurrentCategory(_category);
        const itemsList = productsList
            .filter((p) => p.category === _category)
            .filter((p) => p.quantity > 0);
        setProductsListbyCurrentCategory(itemsList);
        setProductID(itemsList[0].id);
        setQuantityOrdered(0.1);
        setCurrentPrice(itemsList[0].price * 0.1);
    };

    const updateProduct = (_productID) => {
        setProductID(_productID);

        const _product = productsList.find((p) => p.id === _productID);
        const currPrice = _product.price * quantityOrdered;

        setCurrentPrice(currPrice);
    };

    const updateQuantity = (_quantity) => {
        const prod = productsList.find((p) => p.id === productID);

        setCurrentPrice(parseFloat(prod.price) * parseFloat(_quantity));
        setQuantityOrdered(parseFloat(_quantity));
        setMaxQuantity(parseFloat(prod.quantity));
    };

    return (
        <Form noValidate validated={validated} id={temporaryKey} onSubmit={handleSubmit}>
            <Row>
                <Col xs={12} lg={4}>
                    <FloatingLabel controlId="CategoriesSelect" label="Category" className="mt-2">
                        <Form.Select
                            aria-label="Product categories"
                            defaultValue={currentCategory}
                            onChange={(e) => updateCurrentCategory(e.target.value)}
                            disabled={product}>
                            {categoriesList.map((c, k) => (
                                <option key={k} value={c}>
                                    {c}
                                </option>
                            ))}
                        </Form.Select>
                    </FloatingLabel>
                </Col>

                <Col xs={12} lg={4}>
                    <FloatingLabel controlId="productSelect" label="Product" className="mt-2">
                        <Form.Select
                            aria-label="Product"
                            defaultValue={productID}
                            onChange={(e) => updateProduct(Number(e.target.value))}
                            disabled={product}>
                            {product ? (
                                <option value={product.id}>{product.name} </option>
                            ) : (
                                productsListbyCurrentCategory &&
                                productsListbyCurrentCategory.map((p, k) => (
                                    <option key={k} value={p.id}>
                                        {p.name} {p.price}€/{p.unit}
                                    </option>
                                ))
                            )}
                        </Form.Select>
                    </FloatingLabel>
                </Col>

                <Col xs={12} lg={4}>
                    <FloatingLabel
                        controlId="Quantity"
                        label="Quantity"
                        className="mt-2"
                        required
                        onChange={(e) => updateQuantity(e.target.value)}>
                        <Form.Control
                            type="number"
                            placeholder="number"
                            step="0.1"
                            defaultValue={quantityOrdered}
                            min={0.1}
                            max={maxQuantity}
                            disabled={product}
                        />
                        <Form.Control.Feedback type="invalid">
                            Please insert a quantity between 0.1 and {maxQuantity}{' '}
                        </Form.Control.Feedback>
                    </FloatingLabel>
                </Col>
            </Row>

            <Row>
                <Col xs={6} lg={9}>
                    {product ? (
                        ''
                    ) : (
                        <Button type="submit" variant="primary" className="mt-3 mb-3">
                            {' '}
                            Add product{' '}
                        </Button>
                    )}
                </Col>
                <Col className="mt-4" xs={6} lg={3}>
                    {productID && !product
                        ? 'Current product: ' + parseFloat(currentPrice).toFixed(2) + '€'
                        : ''}
                </Col>
            </Row>
        </Form>
    );
}

export default ClientOrderForm;
