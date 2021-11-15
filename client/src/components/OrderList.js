import { Card, CardGroup } from "react-bootstrap";
import OrderItem from './OrderItem';
import './OrderList.css';
import { useEffect, useState } from 'react';
import api_getOrders from '../Api';

function OrderList() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
      /*
      api_getOrders().then((orders) => {
    	setOrders(orders);
    	}).catch((e) =>console.log(e));
    */
      const loadOrders = async () => {
        const res = await api_getOrders();
        setOrders(res);
      } 
      loadOrders();
    }, [setOrders]);
  
  const orderList = orders.map( (order) => 
                            <div key={order.orderId.toString()}  className="OrderItem">
                            <OrderItem key={order.orderId.toString()} order={order} />
                            </div>)

  return (
    <div>
      <div className="Title">
        <h2>Orders</h2>
      </div>
      <div className="OrderList">
        {orderList}
      </div>
    </div>   
  );
}

export default OrderList;