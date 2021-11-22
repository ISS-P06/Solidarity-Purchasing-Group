import {Row, Col, ListGroup, Image} from 'react-bootstrap'

export default function ProductItem(props) {

    const regex = /[ _]/g;
    let imgName = props.product.category.replace(regex, '-').toLowerCase() + '-16x11.png';
    let imgPath = '/img/products/' + imgName;

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
                        Unit Price: €/Kg {props.product.price}. <br />
                        Price: € {(props.product.price * props.product.quantity).toFixed(2)}.
                    </div>
                </Col>
            </Row>
        </ListGroup.Item>
    )
}