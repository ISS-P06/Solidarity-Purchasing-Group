import {Container, Row, Col, Pagination, Form, Spinner, Button, Card} from 'react-bootstrap';
import {useState, useEffect} from 'react';
import {api_getProducts, api_addProductToBasket, api_getFarmerProducts} from '../../Api';
import {addMessage} from '../Message';
import {Link} from 'react-router-dom';
import ProductCard from './ProductCard';
import FarmerProductForm from '../farmer/FarmerProductForm';
import { checkOrderInterval } from '../../utils/date';

const ProductCards = (props) => {
    const {userRole, userId, virtualTime, setOpenBasketOffCanvas} = props;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchedProduct, setSearchedProduct] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);
    const [farmerProductFormShow, setFarmerProductFormShow] = useState(false); /* used for opening farmerProductFormShow modal*/

    // product { id, name, description, category, quantity, price, unit, ref_farmer, farm_name }
    const [productList, setProductList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All categories');
    const categories = ["All categories", ...new Set(productList.map(p => p.category))];

    useEffect(() => {
        const apiCall = userRole === "farmer" ? api_getFarmerProducts(userId) : api_getProducts();
        apiCall.then((products) => {
            setProductList(products);
            setLoading(false);
        }).catch((e) => {
            addMessage({message: e.message, type: 'danger'});
            setLoading(false);
        });
    }, [virtualTime]);

    // go up after changing page
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    // pagination start
    const indexOfLastProduct = currentPage * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const filterOn = searchText.length > 0 || selectedCategory !== "All categories";
    const currentProducts = filterOn ?
        searchedProduct.slice(indexOfFirstProduct, indexOfLastProduct) :
        productList.slice(indexOfFirstProduct, indexOfLastProduct)
    const pageNumbers = [];

    let endPage = filterOn ?
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
     * This function calls the api of reference to add product on the basket
     * @param {*} reservedQuantity
     *  - The quantity to add in the basket
     * @param {*} productId
     *  - The id of the product we wnat to add
     */
    const handleAddProductToBasket = async (reservedQuantity, productId) => {
        await api_addProductToBasket(userId, productId, reservedQuantity)
            .then(() => {
                setOpenBasketOffCanvas(true);
                props.handleAddProduct();
            }).catch((e) => addMessage({message: e.message, type: 'danger'}));
    }

    const handleOnSearchProduct = (text) => {
        setSearchText(text);
        const products = filterProducts(text, selectedCategory);
        setSearchedProduct(products);
        setCurrentPage(1);
    }

    const handleOnSwitchCategory = (category) => {
        setSelectedCategory(category);
        const products = filterProducts(searchText, category);
        setSearchedProduct(products);
        setCurrentPage(1);
    }

    /**
     * Filters the products by name and category
     * It also manages error messages in case no products are found
     * @param {*} name Name filter
     * @param {*} category Category filter
     * @returns Filtered products
     */
    const filterProducts = (name, category) => {
        var searchExpr = new RegExp('^' + name, 'i');

        let products = productList
            .filter((p) => {
                if (category === "All categories")
                    return true;
                return p.category === category
            })
            .filter((p) => searchExpr.test(p.name));

        if (products.length === 0 && name.length > 0) {
            setError("Sorry there are no products with name " + name);
        } else {
            setError('');
        }

        return products;
    }


    return (
        loading ? <Spinner animation="border" variant="success" className={"mt-3"}/> : (
            <Container style={{textAlign: 'left'}}>
                <Row className="mt-4">
                    <Col style={{display: 'flex', justifyContent: 'center'}}>
                        <h3>Browse products</h3>
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col xs={2}></Col>
                    <Col xs={8} style={{display: 'flex', justifyContent: 'center'}}>
                        {productList.length !== 0 &&
                        <Form>
                            <Container>
                                <Row>
                                    <Col xs={12} sm={6}>
                                        <Form.Control
                                            value={searchText}
                                            type="text"
                                            placeholder="Search Product"
                                            onChange={(e) => handleOnSearchProduct(e.target.value)}/>
                                    </Col>
                                    <Col xs={12} sm={6}>
                                        <Form.Select
                                            value={selectedCategory}
                                            onChange={(e) => handleOnSwitchCategory(e.target.value)}>
                                            {categories.map((c) => {
                                                return <option value={c}>{c}</option>
                                            })}
                                        </Form.Select>
                                    </Col>
                                </Row>
                            </Container>
                        </Form>
                        }
                    </Col>
                    <Col xs={2} style={{display: 'flex', justifyContent: 'right'}}>
                        {userRole === "farmer" &&
                            <Button onClick={()=>setFarmerProductFormShow(true)}>Add new product</Button>

                        }
                    </Col>
                </Row>
                <Row className="mt-4 justify-content-center">
                    {productList.length === 0 && (
                        <Col style={{display: 'flex', justifyContent: 'center'}}>
                            <h5>No products found for this week</h5>
                        </Col>
                    )}
                    {error && (
                        <Col style={{display: 'flex', justifyContent: 'center'}}>
                            <h5>{error}</h5>
                        </Col>
                    )}
                    {currentProducts.map((p) => {
                        return <ProductCard key={p.id} product={p} userRole={userRole}
                                            onBasketAdd={handleAddProductToBasket} virtualTime={virtualTime}/>;
                    })}
                </Row>
                {userRole === "client" && !checkOrderInterval(virtualTime) &&
                <Card
                    className="shadow"
                    style={{marginLeft: 'auto', marginRight: 'auto', maxWidth: '40rem'}}>
                    <div style={{padding: '4%'}}>
                        <h5><u> Sorry, but orders are accepted only from Sat. 9am until Sun. 11pm. </u></h5>
                    </div>
                </Card>
                }
                {!error && (<Row className="mt-3 mb-3">
                    <Col style={{display: 'flex', justifyContent: 'center'}}>
                        {productList.length !== 0 &&
                        <Pagination size="md">
                            {currentPage !== 1 && <Pagination.First onClick={() => setCurrentPage(1)}/>}
                            {currentPage !== 1 && <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)}/>}
                            {pageNumbers.map((i) => (
                                <Pagination.Item key={i} active={currentPage === i} onClick={() => setCurrentPage(i)}>
                                    {i}
                                </Pagination.Item>
                            ))}
                            {currentPage !== endPage &&
                            <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)}/>}
                            {currentPage !== endPage && <Pagination.Last onClick={() => setCurrentPage(endPage)}/>}
                        </Pagination>
                        }
                    </Col>
                </Row>)}
                <FarmerProductForm
                    user={{id:userId}}
                    show={farmerProductFormShow}
                    handleClose={() => setFarmerProductFormShow(false)}
                />
            </Container>
        )
    );
};

export default ProductCards;
