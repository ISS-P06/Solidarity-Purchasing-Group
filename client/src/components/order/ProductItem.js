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
                <Col className="mt-2">
                <Button style={{position: 'absolute', bottom: '10%', right: '2%'}} className="float-end btn mr-2" variant="primary" onClick={() => handleRemoveProduct(props.product.productId)} >Remove</Button>
                </Col>
            </Row>
        </ListGroup.Item>
    )
}