import ProductItem from './ProductItem'

import {ListGroup} from 'react-bootstrap'

export default function ProductList(props) {

    const productList = props.productList.map(
        (product) => {
            return (<ProductItem product={product}/>)
        }
    );

    return (
        <div>
            <ListGroup variant="flush">
                {productList}
                <ListGroup.Item></ListGroup.Item>
            </ListGroup>
        </div>
    );
}