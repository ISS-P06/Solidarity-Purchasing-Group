import {Row, Col, ListGroup, Image, Button} from 'react-bootstrap'

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
                <Col>
                    <Image src={imgPath} fluid rounded/>          
                </Col>
                <Col style={{ textAlign: 'left' }}>
                    <h5>{props.product.name}</h5>
                    <div style={{position: 'absolute', bottom: '10%'}} >
                        Reserved quantity: {props.product.quantity} Kg.<br />
                        Unit Price: €/{props.product.unit} {props.product.price}. <br />
                        Price: € {(props.product.price * props.product.quantity).toFixed(2)}.
                    </div>
                </Col>
                <Col>
                <Button style={{position: 'absolute', bottom: '10%'}} className="float-end btn mr-2" variant="primary" onClick={() => handleRemoveProduct(props.product.productId)} >Remove</Button>
                </Col>
            </Row>
        </ListGroup.Item>
    )
}