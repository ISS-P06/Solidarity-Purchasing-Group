import { Modal, Button, Form, Col, FloatingLabel, Row, Container } from "react-bootstrap";

import { useState, useEffect } from "react";
import { api_getProducts, api_addOrder } from '../Api';
import AlertBox from "./Message";

function ClientOrderForm(props) {
    const { show, onHide, client, alert,setAlert, message,setMessage } = props;

    const [messageModal, setMessageModal] = useState("");
    const [alertModal, setAlertModal] = useState(false);
    const [productsList, setProductsList] = useState([]);
    const [categoriesList, setCategoriesList] = useState([]);
    const [productsClient, setProductsClient] = useState([]); /* list of the products ordered by the client */
    const [temporaryKey, setTemporaryKey] = useState(0);
    const [partialPrice, setPartialPrice] = useState(0);
    const [insertProduct, setInsertProduct] = useState(true); //is true when the shop employee is adding a new product

    useEffect(() => {
      
        api_getProducts()
            .then((products) => {
                const distinctCategoriesList = [];
                products.map((p) => (p.category)).forEach((c) => {
                    if (!distinctCategoriesList.includes(c)) {
                        distinctCategoriesList.push(c);
                    }
                })
                setProductsList(products);
                setCategoriesList(distinctCategoriesList);
            })
            .catch((e) =>   setMessage({ msg: e, type: "danger" }));
    }, [onHide]);


    const handleClose = () => {
        onHide();
    };

    const addOrder = () => {
      
        if (productsClient.length == 0) {
            setMessageModal({ msg: "Complete add at least one product", type: "danger" });
            setAlertModal(true);
        }
        else if(insertProduct){
            setMessageModal({ msg: "Complete the addition of the last product", type: "danger" });
            setAlertModal(true);
        }
        else {
            //send the request
            var order = productsClient.map((p) => ({
                id: p.id,
                quantity: p.quantity
            }));
            var orderClient={clientID :client.id, order:order };

            /*Message*/
            api_addOrder(orderClient)
            .then((id)=>setMessage({ msg: "The order " + id + " is emitted with success ", type: "success" }))
            .catch((err)=>{
                setMessage({ msg: err.message, type: "danger" })
            });

            /*RESET*/
            setProductsClient([]);
            setPartialPrice(0);
            setInsertProduct(true);
            handleClose();
        

            /*TODO verify wallet of the customer */
        }
    }

    return (
        <Modal size='lg' aria-labelledby='contained-modal-title-vcenter' centered show={show} onHide={handleClose}>
          
            <Modal.Header closeButton>
                <Modal.Title id='contained-modal-title-vcenter'> Add a new client order</Modal.Title>
              
            </Modal.Header>
            <AlertBox alert={alertModal} setAlert={setAlertModal} message={messageModal} />
            <Modal.Body>
            
                {productsClient ? productsClient.map((product, index) => (
                    <ProductForm key={product.temporaryKey} temporaryKey={temporaryKey} setTemporaryKey={setTemporaryKey} insertProduct={insertProduct} setInsertProduct={setInsertProduct} partialPrice={partialPrice} setPartialPrice={setPartialPrice} productsList={productsList} setProductsList={setProductsList} productsClient={productsClient} setProductsClient={setProductsClient} categoriesList={categoriesList} product={product}></ProductForm>
                )) : ""
                }
                <Row className="m-2 justify-content-end">
                    {productsClient.length > 0 ? "Partial total: " + parseFloat(partialPrice).toFixed(2) + " $" : ""}

                </Row>



                {insertProduct && productsList ?
                    <>
                        <h5>New Product</h5>
                        <ProductForm key={temporaryKey} temporaryKey={temporaryKey} setTemporaryKey={setTemporaryKey} insertProduct={insertProduct} setInsertProduct={setInsertProduct} partialPrice={partialPrice} setPartialPrice={setPartialPrice} productsList={productsList} setProductsList={setProductsList} productsClient={productsClient} setProductsClient={setProductsClient} categoriesList={categoriesList} ></ProductForm>
                    </>

                    : ""}

                {!insertProduct && <Button className="mt-3 mb-3" variant="primary" onClick={() => setInsertProduct(true)} > Add new product </Button>}

               
            </Modal.Body>
            <Modal.Footer>

                <Button  md='auto' onClick={addOrder}>
                    Add order
                </Button>
                <Button variant='danger' onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal >
    );
}

function ProductForm(props) {
    const { temporaryKey, setTemporaryKey, insertProduct, setInsertProduct, partialPrice, setPartialPrice, productsList, setProductsList, productsClient, setProductsClient, categoriesList, product } = props;
    const [validated, setValidated] = useState(false);


    const [currentCategory, setCurrentCategory] = useState(product ? product.category : categoriesList[0]);
    const [productsListbyCurrentCategory, setProductsListbyCurrentCategory] = useState();


    const [productID, setProductID] = useState(); /* current product id */
    const [quantityOrdered, setQuantityOrdered] = useState(); /* current quantity of the product  */
    const [maxQuantity, setMaxQuantity] = useState(); /* quantity available of the product  */
    const [currentPrice, setCurrentPrice] = useState();


    useEffect(() => {


        const itemsList = productsList.filter((p) => (p.category == categoriesList[0])).filter((p) => (p.quantity > 0));
        setProductsListbyCurrentCategory(itemsList);

        setProductID(product ? product.id : itemsList[0].id);
        setQuantityOrdered(product ? product.quantityOrdered : 0.1);
        setMaxQuantity(product ? "" : itemsList[0].quantity);
        setCurrentPrice(product ? 0 : itemsList[0].price * 0.1); 
      
    }, []);



    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity() === true) {
            var productToAdd = { ...productsList.find((p) => (p.id == productID)) };

            if (productToAdd) {
                productToAdd.quantityOrdered = quantityOrdered;
                productToAdd.temporaryKey = temporaryKey;
                setTemporaryKey((temporaryKey) => temporaryKey + 1);

                setProductsList(productsList.map(p =>
                    /* update available quantity */
                    p.id == productID
                        ? { ...p, quantity: (p.quantity - quantityOrdered) }
                        : p
                ));

                /* add new product */
                setProductsClient((products) => [...products, productToAdd]);

                /*update total price */

                var addPrice = parseFloat(productToAdd.quantityOrdered).toFixed(2) * parseFloat(productToAdd.price).toFixed(2);
                setPartialPrice(parseFloat(partialPrice) + parseFloat(addPrice));

                setInsertProduct(false);

            }
            setValidated(false);
        } else {
            setValidated(true);
        }
    }

    const updateCurrentCategory = (event) => {
        setCurrentCategory(event.target.value);
        const itemsList = productsList.filter((p) => (p.category == event.target.value)).filter((p) => (p.quantity > 0));
        setProductsListbyCurrentCategory(itemsList);
        setProductID(itemsList[0].id);
        setQuantityOrdered(0.1);
        setCurrentPrice(itemsList[0].price * 0.1);
    }

    const updateProduct = (event) => {
        setProductID(event.target.value);
        setCurrentPrice(productsList.find(((p) => (p.id == event.target.value))).price * quantityOrdered);
    }
    const updateQuantity = (event) => {
        setCurrentPrice(parseFloat(productsList.find(((p) => (p.id == productID))).price * parseFloat(event.target.value)));
        setQuantityOrdered(parseFloat(event.target.value));
        setMaxQuantity(parseFloat(productsList.find(((p) => (p.id == productID))).quantity));
    }

    return (
        <Form noValidate validated={validated} id='addOrder' onSubmit={handleSubmit}>
            <Row>
                <Col xs={12} lg={4}>
                    <FloatingLabel controlId="CategoriesSelect" label="Category" className="mt-2">
                        <Form.Select aria-label="Product categories" defaultValue={currentCategory} onChange={updateCurrentCategory} disabled={product}>
                            {categoriesList.map((c) => <option value={c}>{c}</option>)}
                        </Form.Select>
                    </FloatingLabel>
                </Col>


                <Col xs={12} lg={4}>
                    <FloatingLabel controlId="productSelect" label="Product" className="mt-2" >
                        <Form.Select aria-label="Product" defaultValue={productID} onChange={updateProduct} disabled={product}>
                            {product ? <option value={product.id}>{product.name} </option> : productsListbyCurrentCategory && productsListbyCurrentCategory.map((p) => <option value={p.id}>{p.name} {p.price} $</option>)}
                        </Form.Select>
                    </FloatingLabel>
                </Col>

                <Col xs={12} lg={4}>
                    <FloatingLabel controlId="Quantity" label="Quantity (Kg)" className="mt-2" required onChange={(event) => updateQuantity(event)}>
                        <Form.Control type="number" placeholder="number" step="0.1" defaultValue={quantityOrdered} min={0.1} max={maxQuantity} disabled={product} />
                        <Form.Control.Feedback type="invalid">Please insert a quantity between 0.1 and {maxQuantity} </Form.Control.Feedback>
                    </FloatingLabel>
                </Col>

            </Row>

            <Row >
                <Col xs={6} lg={9}>
                    {product ? "" : <Button type="submit" variant="primary" className="mt-3 mb-3" > Add product </Button>}
                </Col>
                <Col className="mt-4" xs={6} lg={3}>
                    {productID && !product ? "Current product: " + currentPrice.toFixed(2) + "$" : ""}
                </Col>
            </Row>




        </Form>
    );
}


export default ClientOrderForm;

