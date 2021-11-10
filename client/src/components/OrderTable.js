import { Table } from "react-bootstrap";

function OrderTable(props) {

  const productList = props.products.map((product) => {
      return <tr>
        <td>{product.productName}</td>
        <td>{product.quantity}</td>
        <td> €/Kg {product.price}</td>
      </tr>
    }
  );

  function computeTotal(products) {
    let total = 0.00;
    for (let i = 0; i < products.length; i++){
      total += products[i].price * products[i].quantity;
    }
    return total;
  }
  
  return <Table striped bordered hover>
   <thead>
     <tr>
       <th>Product Name</th>
       <th>Quantity</th>
       <th>Price</th>
     </tr>
   </thead>
   <tbody>
       {productList}
       <tr><td>Total: </td><td></td><td>€ {computeTotal(props.products)}</td></tr>
   </tbody>
 </Table>;
}

export default OrderTable;
