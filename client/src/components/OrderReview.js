import { Card, CardGroup, Button } from "react-bootstrap";
import { BoxArrowInUp } from 'react-bootstrap-icons';
import OrderTable from './OrderTable';
import './OrderReview.css';

function OrderReview(props) {

    const handleDelivery = () => {

        const orderId = props.orderReview.orderId;

        props.onDelivery(orderId);

    }

    return (
        <div calssName="OrderReview">
            <div className="Title">
                <h2>Order Review</h2>
            </div>
            <Card>
                <Card.Header>ID: #{props.orderReview.orderId}</Card.Header>
                <Card.Body> <div className="Owner" >Owner: {props.orderReview.email} </div> <br /> <br />
                <OrderTable products={props.orderReview.products}/>
                State: {props.orderReview.state} <br /><br />
                <Button onClick={handleDelivery} > <BoxArrowInUp /> Deliver </Button> </Card.Body>
            </Card>
        </div>
    );
}

export default OrderReview;