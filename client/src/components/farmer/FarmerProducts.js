import { Button } from 'react-bootstrap/';
import { Link } from 'react-router-dom';


const FarmerProducts = (props) => {
    return <>
        <Link to="/farmer/products/new">
            <Button>Add new product</Button>
        </Link>
    </>;
}

export default FarmerProducts;
