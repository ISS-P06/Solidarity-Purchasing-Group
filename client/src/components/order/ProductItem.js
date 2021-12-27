import {Row, Col, ListGroup, Image, Button} from 'react-bootstrap'

/**
 * This component is an entry inside the basket show the product image, the relative information on the quantity and the price
 * @param {*} props {product}
 * 
 */
export default function ProductItem(props) {

    const regex = /[ _]/g;
    let imgName = props.product.category.replace(regex, '-').toLowerCase() + '-16x11.png';
    let imgPath = '/img/products/' + imgName;

    const handleRemoveProduct = (productId) => {
        props.removeProduct(productId);
    };

    return(
        <ListGroup.Item>
            <Row>
                <Col className="pt-2">
                    <Image src={imgPath} fluid rounded/>          
                </Col>
                <Col style={{ textAlign: 'left' }}>
                    <h5>{props.product.name}</h5>
                    <div style={{bottom: '10%', fontSize: '11pt'}} >
                        Reserved quantity: {props.product.quantity} Kg.<br />
                        Unit Price: €/{props.product.unit} {props.product.price}. <br />
                        Price: € {(props.product.price * props.product.quantity).toFixed(2)}.
                    </div>
                </Col>

            </Row>
            <Row >
                <Col className="mt-2">
                    <Button className="float-end btn" variant="primary" onClick={() => handleRemoveProduct(props.product.productId)} >Remove</Button>
                </Col>
            </Row>
        </ListGroup.Item>
    )
}