import { useEffect, useState } from 'react';
import { Button, Card, Alert } from 'react-bootstrap';
import { api_getBasket, api_buyNow, api_removeProductFromBasket } from '../../Api';
import ProductCards from '../ProductCards';
import ProductList from './ProductList';
import { addMessage } from '../Message';

export default function Basket(props) {
  const [basket, setBasket] = useState([]);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isUpdated, setIsUpdated] = useState(false);

  const handleBuyNow = async (userId) => {
    await api_buyNow(userId)
      .then(() => {
        addMessage({ title: 'order', message: 'Your order has been inserted!' });
        setIsUpdated(false);
      })
      .catch((e) => console.log(e));
  };

  const handleRemoveProduct = async (productId) => {
    await api_removeProductFromBasket(props.userId, productId)
      .then(() => {
        setIsUpdated(true);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleAddProduct = async (productId) => {
    setIsUpdated(true);
  };

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
      })
      .catch((e) => {
        console.log(e);
      });
  }, [isUpdated, setIsUpdated]);

  return (
    <>
      <BasketProductList
        isEmpty={isEmpty}
        basket={basket}
        userId={props.userId}
        computeTotal={computeTotal}
        handleRemoveProduct={handleRemoveProduct}
        handleBuyNow={handleBuyNow}
      />
      <ProductCards
        userRole={props.userRole}
        userId={props.userId}
        handleAddProduct={handleAddProduct}
      />
    </>
  );
}

const BasketProductList = (props) => {
  const { isEmpty, basket, handleRemoveProduct, computeTotal, handleBuyNow, userId } = props;

  return (
    <div class="main">
      <div class="title" style={{ padding: '2%' }}>
        <h2> Basket </h2>
      </div>
      <Card
        className="shadow"
        style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: '35rem' }}>
        {isEmpty ? (
          <div style={{ padding: '4%' }}>
            <h5> There are no products in the basket </h5>
          </div>
        ) : (
          <div>
            <div style={{ padding: '2%' }} class="productList">
              <ProductList productList={basket} removeProduct={handleRemoveProduct} />
            </div>
            <div style={{ padding: '0 4% 2% 0' }}>
              <h5>Total: € {computeTotal(basket).toFixed(2)}</h5>
            </div>
          </div>
        )}
        {isEmpty ? null : (
          <Card.Footer>
            <Button className="float-end btn mr-2" onClick={() => handleBuyNow(userId)}>
              Buy Now
            </Button>
          </Card.Footer>
        )}
      </Card>
    </div>
  );
};
