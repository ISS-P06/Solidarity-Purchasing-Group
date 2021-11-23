import { useEffect, useState } from 'react';
import ProductList from './ProductList';
import {Button, Card, Alert} from 'react-bootstrap';
import { api_getBasket, api_buyNow, api_removePruductFromBasket } from '../../Api';

let productData = [{
    productId: 1,
    category: "fruits-and-vegetables",
    name: "Onion",
    price: 0.8,
    unit: 'Kg',
    quantity: 2.6
},
{
    productId: 2,
    category: "fruits-and-vegetables",
    name: "Apple",
    price: 1.5,
    unit: 'Kg',
    quantity: 1.5
}];

export default function Basket(props) {

    const [basket, setBasket ] = useState([]);
    const [isEmpty, setIsEmpty ] = useState(true);
    const [wellDone, setWellDone] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);

    const handleBuyNow = async (userId) => {
        await api_buyNow(userId);
        setWellDone(true);
        setIsUpdated(false);
    }

    const handleRemoveProduct = async (productId) => {
        await api_removePruductFromBasket(props.userId, productId).then(() => {
            setIsUpdated(false);
        }).catch((e) => { console.log(e);})
    }

    function computeTotal(products) {
        let total = 0.0;
        products.forEach((product) => {
            total += product.quantity * product.price;
        })
        return total;
      }

    useEffect(() => {
        api_getBasket(props.userId).then((products) => {
                setBasket(products);
                if(products.length > 0) {
                    setIsEmpty(false);
                } else {
                    setIsEmpty(true);
                }
                setIsUpdated(true);
            }).catch((e) => {
                console.log(e);
        })

        /*
        setBasket(productData);
        setIsEmpty(false);
        setIsUpdated(true);
        */
    }, [])

    return(
        <div class="main">
            <div class="title" style={{padding: '2%'}}> <h2> Basket </h2></div>
            <Card className="shadow" style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: '35rem'}}>
                { isEmpty ? <div style={{padding: '4%'}}> <h5> There are no products in the basket </h5> </div> : 
                <div>
                    <div style={{padding: '2%'}} class="productList"><ProductList productList={basket} removeProduct={handleRemoveProduct}/></div>
                    <div style={{padding: '0 4% 2% 0', float: 'right'}} >
                        <h5>Total: € {computeTotal(basket).toFixed(2)}</h5>
                    </div>
                </div>
                }
                {isEmpty ? <></> :
                    <Card.Footer>
                        <Button className="float-end btn mr-2" onClick={() => handleBuyNow(props.userId)} >Buy Now</Button>
                    </Card.Footer>}                   
            </Card>
            {wellDone ? <Alert variant="success">
                Well done, your order has been inserted!
            </Alert> : <></> }
        </div>           
    );

}