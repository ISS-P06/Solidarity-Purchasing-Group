import { Modal, Button, Form, Col, FloatingLabel, Row, InputGroup, FormControl } from "react-bootstrap";

import { useState, useEffect } from "react";
import { api_getProducts } from '../Api';

function ClientOrderForm(props) {
    const { show, onHide, client } = props;

    const [productsList, setProductsList] = useState([]);
    const [categoriesList, setCategoriesList] = useState([]);

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
            .catch((e) => console.log(e) /*TODO manage error*/);
    }, []);


    const handleClose = () => {

        onHide();
    };

    return (
        <Modal size='lg' aria-labelledby='contained-modal-title-vcenter' centered show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title id='contained-modal-title-vcenter'> Add a new client order</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {productsList ? <AddNewProductForm productsList={productsList} categoriesList={categoriesList}></AddNewProductForm> : "There is not products available this week"}

            </Modal.Body>
            <Modal.Footer>
                <Button type='submit' form='addOrder' md='auto'>
                    Add
                </Button>
                <Button variant='danger' onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

function AddNewProductForm(props) {
    const { productsList, categoriesList } = props;
    const [validated, setValidated] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(categoriesList[0]);
    const [productsListbyCurrentCategory, setProductsListbyCurrentCategory] = useState();
    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState();

    useEffect(() => {
        const itemsList = productsList.filter((p) => (p.category === categoriesList[0]));
        setProductsListbyCurrentCategory(itemsList);

    }, []);


    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true) {
        } else {
            setValidated(true);
        }
    }

    const updateCurrentCategory = (event) => {
        setCurrentCategory(event.target.value);
        const itemsList = productsList.filter((p) => (p.category === event.target.value));
        setProductsListbyCurrentCategory(itemsList);
    }



    return (
        <Form noValidate validated={validated} id='addOrder' onSubmit={handleSubmit}>
            <Row>
                <Col xs={12} lg={4}>
                    <FloatingLabel controlId="CategoriesSelect" label="Categories" className="mt-2">
                        <Form.Select aria-label="Product categories" defaultValue={currentCategory} onChange={updateCurrentCategory}>
                            {categoriesList.map((c) => <option value={c}>{c}</option>)}
                        </Form.Select>
                    </FloatingLabel>
                </Col>


                <Col xs={12} lg={4}>
                    <FloatingLabel controlId="productSelect" label="Products" className="mt-2" onChange={(event) => setProduct(productsList.find((p) => (p.id == event.target.value)))}>
                        <Form.Select aria-label="Products" defaultValue={product.name}>
                            {productsListbyCurrentCategory && productsListbyCurrentCategory.map((p) => <option value={p.id}>{p.name}</option>)}
                        </Form.Select>
                    </FloatingLabel>
                </Col>

                <Col xs={12} lg={4}>
                    <FloatingLabel controlId="Quantity" label="Quantity (Kg)" className="mt-2" onChange={(event) => setQuantity(event.target.value)} >
                        <Form.Control type="number" placeholder="number" step="0.1" />
                    </FloatingLabel>

                </Col>

            </Row>
        </Form>
    );
}


export default ClientOrderForm;

