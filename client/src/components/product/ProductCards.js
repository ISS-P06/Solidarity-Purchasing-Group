import { Container, Row, Col, Pagination, Form, Spinner, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { api_getProducts, api_addProductToBasket, api_getFarmerProducts } from '../../Api';
import { addMessage } from '../Message';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

const ProductCards = (props) => {
    const { userRole, userId, virtualTime } = props;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchedProduct, setSearchedProduct] = useState([]);
    const [searchText, setSearchText] = useState('');

    // product { id, name, description, category, quantity, price, unit, ref_farmer, farm_name }
    const [productList, setProductList] = useState([]);

    useEffect(() => {
        if (userRole === "farmer") {
            api_getFarmerProducts(userId)
                .then((products) => {
                    setProductList(products);
                    setLoading(false);
                })
                .catch((e) => {
                    addMessage({ message: e.message, type: 'danger' });
                    setLoading(false);
                });
        } else {
            api_getProducts()
                .then((products) => {
                    setProductList(products);
                    setLoading(false);
                })
                .catch((e) => {
                    addMessage({ message: e.message, type: 'danger' });
                    setLoading(false);
                });
        }
    }, [virtualTime]);

    // pagination start
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);

    // go up after changing page
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    const indexOfLastProduct = currentPage * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = searchText.length > 0 ?
        searchedProduct.slice(indexOfFirstProduct, indexOfLastProduct) :
        productList.slice(indexOfFirstProduct, indexOfLastProduct)
    const pageNumbers = [];

    let endPage = searchText.length > 0 ?
        Math.ceil(searchedProduct.length / productsPerPage) :
        Math.ceil(productList.length / productsPerPage)
    let startPage = currentPage - 2;
    if (startPage < 1)
        startPage = 1;
    if (startPage > endPage - 4)
        startPage = endPage - 4;
    for (let i = startPage; i <= startPage + 4; i++) {
        if (i > 0)
            pageNumbers.push(i);
    }
    // pagination end

    /**
     * The function handleOnSerachProduct take an argument that is the name of the product that you want to looking for,
     * it creates a regular expression to find if the serach text matches the name of each product.
     * If yes the product is added to the list of the product that we want to show.
     * If there are no product with name specified as parameter is set an error that informs you.
     *
     * @param {string} text
     * - text is the product name string you want to looking for.
     */
    const handleOnSearchProduct = (text) => {
        let products = [];
        setSearchText(text);
        var searchExpr = new RegExp('^' + text, 'i');

        productList.forEach((product) => {
            if (searchExpr.test(product.name))
                products.push(product);
        });

        if (products.length === 0 && text.length > 0) {
            setError("Sorry there are no products with name " + text);
        } else {
            setError('');
        }
        setSearchedProduct(products);
        setCurrentPage(1);
    }

    /**
     * This function calls the api of reference to add product on the basket
     * @param {*} reservedQuantity 
     *  - The quantity to add in the basket
     * @param {*} productId 
     *  - The id of the product we wnat to add
     */
    const handleAddProductToBasket = async (reservedQuantity, productId) => {
        await api_addProductToBasket(userId, productId, reservedQuantity)
            .then(() => {
                props.handleAddProduct();
                addMessage({ message: 'Product correctly added to the basket', type: "info" });
            }).catch((e) => addMessage({ message: e.message, type: 'danger' }));
    }

    return (
        loading ? <Spinner animation="border" variant="success" className={"mt-3"} /> : (
            <Container style={{ textAlign: 'left' }}>
                <Row className="mt-4">
                    <Col style={{ display: 'flex', justifyContent: 'center' }}>
                        <h3>Browse products</h3>
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col></Col>
                    <Col style={{ display: 'flex', justifyContent: 'center' }}>
                        <Form>
                            <Form.Control
                                type="text"
                                placeholder="Search Product"
                                onChange={(e) => handleOnSearchProduct(e.target.value)} />
                        </Form>
                    </Col>
                    <Col style={{ display: 'flex', justifyContent: 'right' }}>
                        {userRole === "farmer" &&
                            <Link to="/farmer/products/new">
                                <Button>Add new product</Button>
                            </Link>
                        }
                    </Col>
                </Row>
                <Row className="mt-4">
                    {productList.length === 0 && (
                        <Col style={{ display: 'flex', justifyContent: 'center' }}>
                            <h5>No products found</h5>
                        </Col>
                    )}
                    {error && (
                        <Col style={{ display: 'flex', justifyContent: 'center' }}>
                            <h5>{error}</h5>
                        </Col>
                    )}
                    {currentProducts.map((p) => {
                        return <ProductCard key={p.id} product={p} userRole={userRole}
                            onBasketAdd={handleAddProductToBasket} virtualTime={virtualTime} />;
                    })}
                </Row>
                {!error && (<Row className="mt-3 mb-3">
                    <Col style={{ display: 'flex', justifyContent: 'center' }}>
                        {productList.length !== 0 &&
                            <Pagination size="md">
                                {currentPage !== 1 && <Pagination.First onClick={() => setCurrentPage(1)} />}
                                {currentPage !== 1 && <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} />}
                                {pageNumbers.map((i) => (
                                    <Pagination.Item key={i} active={currentPage === i} onClick={() => setCurrentPage(i)}>
                                        {i}
                                    </Pagination.Item>
                                ))}
                                {currentPage !== endPage && <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} />}
                                {currentPage !== endPage && <Pagination.Last onClick={() => setCurrentPage(endPage)} />}
                            </Pagination>
                        }
                    </Col>
                </Row>)}
            </Container>
        )
    );
};

export default ProductCards;
