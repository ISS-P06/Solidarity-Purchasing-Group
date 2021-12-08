import { Table, Row } from 'react-bootstrap';

/**
 * This functional component shows items inside an order
 * @param {*} props {products}
 *  - product is a custom object containing all the useful iformation to descibe a product
 */
function OrderTable(props) {

  const productList =
    props.products != null
      ? props.products.map((product, k) => {
        return (
          <tr key={k}>
            <td>{product.name}</td>
            <td>{product.quantity}</td>
            <td>{product.price}  €/{product.unit}</td>
            <td>{product.quantity * product.price} €</td>
          </tr>
        );
      })
      : 0;
  
  /**
   * This function computes the total as product quantity times the unit price 
   * @param {*} products 
   *  - the list of the products
   * @returns the total amount of the product
   */
  function computeTotal(products) {
    let total = 0.0;
    products.forEach((product) => {
      total += product.quantity * product.price;
    });
    return total;
  }

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th className="col-3">Product name</th>
            <th className="col-3">Quantity</th>
            <th className="col-3">Price per unit</th>
            <th className="col-3">Cost</th>
          </tr>
        </thead>
        <tbody>{productList}</tbody>
      </Table>
      <Row className="justify-content-end m-1">
        <h4>Total € {props.products != null ? computeTotal(props.products).toFixed(2) : 0}</h4>
      </Row>
    </>
  );
}

export default OrderTable;
