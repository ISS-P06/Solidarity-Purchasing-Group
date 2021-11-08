import { Card, CardGroup } from "react-bootstrap";
import OrderItem from './OrderItem';
import './OrderList.css';

function OrderList(props) {

  const orderList = props.orderList.map((order) => 
    <div className="OrderItem">
      <OrderItem key={order.orderId.toString()}  order={order} />
    </div>
  );

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