import { useEffect, useState } from 'react';
import ProductList from './ProductList';
import {Button, Card, Alert} from 'react-bootstrap';
import { api_getBasket, api_buyNow } from '../../Api';

export default function Basket(props) {

    const [basket, setBasket ] = useState([]);
    const [isEmpty, setIsEmpty ] = useState(true);
    const [wellDone, setWellDone] = useState(false);

    const handleBuyNow = (userId) => {
        if(!isEmpty){
            api_buyNow(userId);
            setWellDone(true);
        }
    }

    function computeTotal(products) {
        let total = 0.0;
        for (let i = 0; i < products.length; i++) {
          total += products[i].price * products[i].quantity;
        }
        return total;
      }

    useEffect(() => {
        api_getBasket(props.userId).then((products) => {
                setBasket(products);
                if(products.length > 0)
                    setIsEmpty(false);
                    else
                    setIsEmpty(true);
            }).catch((e) => {
                console.log(e);
        })
    }, [])

    return(
        <div class="main">
            <div class="title" style={{padding: '2%'}}> <h2> Basket </h2></div>
            <Card className="shadow" style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: '35rem'}}>
                { isEmpty ? <div style={{padding: '4%'}}> <h5> There are no products in the basket </h5> </div> : 
                <div>
                    <div style={{padding: '2%'}} class="productList"><ProductList productList={basket}/></div>
                    <div style={{padding: '0 4% 2% 0', float: 'right'}} >
                        <h5>Total: € {computeTotal(basket).toFixed(2)}</h5>
                    </div>
                </div>
                }
                {isEmpty ? <div></div> :
                    <Card.Footer>
                        <Button className="float-end btn mr-2" onClick={() => handleBuyNow(props.userId)} >Buy Now</Button>
                    </Card.Footer>}                   
            </Card>
            {wellDone ? <Alert variant="success">
                Well done, your order has been inserted!
            </Alert> : <div></div>}
        </div>           
    );

}