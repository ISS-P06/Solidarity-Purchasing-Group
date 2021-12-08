import ProductItem from './ProductItem'

import {ListGroup} from 'react-bootstrap'

/**
 * This component is an abstract list of ProductItem component
 * @param {*} props {productList}
 * 
 */
export default function ProductList(props) {

    const handleRemoveProduct = (productId) => {
        props.removeProduct(productId)
    }

    const productList = props.productList.map(
        (product) => {
            return (<ProductItem product={product} removeProduct={handleRemoveProduct}/>)
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