import {useEffect, useState} from 'react';
import {Button, Card, Row, Col} from 'react-bootstrap';
import {api_getBasket, api_buyNow, api_removeProductFromBasket} from '../../Api';
import ProductList from './ProductList';
import {addMessage} from '../Message';
import {checkOrderInterval} from '../../utils/date';
import ScheduleDelivery from "../client/ScheduleDelivery";

/**
 * This functional components shows the list of items that a given client wants to buy
 *
 * @param {*} props: {userID, virtualTime}
 * It has two properties userId and virtualTime,
 * the first properties is used to identify which clinet the basket belongs,
 * the seconf one virtualTime is used to check if the basket is available for that time
 *
 */
export default function Basket(props) {
    const [basket, setBasket] = useState([]);
    const [isEmpty, setIsEmpty] = useState(true);
    const [isUpdated, setIsUpdated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [scheduleDeliveryModal, setScheduleDeliveryModal] = useState(false);
    const [orderID, setOrderID] = useState();
    const virtualTime=props.virtualTime;
    /**
     * This function handles the buy now action
     * @param {int} userId
     *  - id of the client
     */
    const handleBuyNow = (userId) => {
        api_buyNow(userId)
            .then((id) => {
                setIsUpdated(true);
                setOrderID(id);
                setScheduleDeliveryModal(true);
            })
            .catch((e) => addMessage({title: "Error", message: e.message, type: 'danger'}));
    };

    /**
     * This function handles what happen if we click on the remove button, it removes a product specified as parameter from the basket
     * @param {int} productId
     *  - id of the product you want to remove
     */
    const handleRemoveProduct = (productId) => {
        api_removeProductFromBasket(props.userId, productId)
            .then(() => {
                setIsUpdated(true);
            })
            .catch((e) => {
                addMessage({title: "Error", message: e.message, type: 'danger'});
            });
    };

    /**
     * This function computes the total as product quantity times the unit price
     * @param {*} products
     *  - the list of the products
     * @returns the total amount of the product
     */
    function computeTotal(products) {
        let total = 0.0;
        products.forEach((product) => {
            total += product.quantity * product.price;
        });
        return total;
    }

    useEffect(() => {
        api_getBasket(props.userId)
            .then((products) => {
                setBasket(products);
                if (products.length > 0) {
                    setIsEmpty(false);
                } else {
                    setIsEmpty(true);
                }
                setIsUpdated(false);
                setLoading(false);
            })
            .catch((e) => {
                setLoading(false);
            });
            // eslint-disable-next-line
    }, [isUpdated, setIsUpdated, props.virtualTime]);

    return (
        <>
            <BasketProductList
                isEmpty={isEmpty}
                basket={basket}
                userId={props.userId}
                computeTotal={computeTotal}
                handleRemoveProduct={handleRemoveProduct}
                handleBuyNow={handleBuyNow}
                loading={loading}
                virtualTime={props.virtualTime}
            />
            <ScheduleDelivery orderID={orderID} show={scheduleDeliveryModal} setShow={setScheduleDeliveryModal} virtualTime={virtualTime} handleCloseBasketCanvas={props.handleClose}/>
        </>
    );
}

const BasketProductList = (props) => {
    const {isEmpty, basket, handleRemoveProduct, computeTotal, handleBuyNow, userId} = props;

    return (
        <div class="main " style={{height:"100%"}}>
            {checkOrderInterval(props.virtualTime) ? (
                <Card
                    className="shadow"
                    style={{marginLeft: 'auto', marginRight: 'auto', maxWidth: '35rem', height:'82%',   overflowY:"auto"}}>
                    {isEmpty ? (
                        <div style={{padding: '4%'}}>
                            <h5> There are no products in the basket </h5>
                        </div>
                    ) : (
                        <div>
                            <div style={{padding: '2%'}} class="productList">
                                <ProductList productList={basket} removeProduct={handleRemoveProduct}/>
                            </div>
                            <div style={{textAlign: 'center'}}>
                                <h5>Total: € {computeTotal(basket).toFixed(2)}</h5>
                            </div>
                        </div>
                    )}

                </Card>) : (
                <Card
                    className="shadow"
                    style={{marginLeft: 'auto', marginRight: 'auto', maxWidth: '35rem'}}>
                    <div style={{padding: '4%'}}>
                        <h5><u> Sorry, but orders are accepted only from Sat. 9am until Sun. 11pm. </u></h5>
                    </div>
                </Card>

            )
            }
            {isEmpty ? null : (
                <Row className="justify-content-center mt-3 " style={{ height:'18%'}}>
                    <Col xs={10} style={{textAlign: 'center'}} >
                        <Button className="btn mb-2" style={{paddingLeft:"100px", paddingRight:"100px"}}  onClick={() => handleBuyNow(userId)}>
                            Buy Now
                        </Button>
                    </Col>

                </Row>
            )}


        </div>
    );
};
