import { Table, Row } from 'react-bootstrap';

function OrderTable(props) {
  const productList =
    props.products != null
      ? props.products.map((product, k) => {
          return (
            <tr key={k}>
              <td>{product.name}</td>
              <td>{product.quantity}</td>
              <td> €/Kg {product.price}</td>
            </tr>
          );
        })
      : 0;

  function computeTotal(products) {
    let total = 0.0;
    for (let i = 0; i < products.length; i++) {
      total += products[i].price * products[i].quantity;
    }
    return total;
  }

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{productList}</tbody>
      </Table>
      <Row className="justify-content-end m-1">
        <h4> Total € {props.products != null ? computeTotal(props.products) : 0}</h4>
      </Row>
    </>
  );
}

export default OrderTable;
