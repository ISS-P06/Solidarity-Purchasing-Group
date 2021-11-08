import { Table } from "react-bootstrap";

function OrderTable(props) {

    const productList = props.products.map((product) => {
        return <tr>
        <td>{product.productName}</td>
        <td>{product.quantity}</td>
      </tr>
    }) 

   return <Table striped bordered hover>
   <thead>
     <tr>
       <th>Product Name</th>
       <th>Quantity</th>
     </tr>
   </thead>
   <tbody>
       {productList}
   </tbody>
 </Table>;
}

export default OrderTable;
