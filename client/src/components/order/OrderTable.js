import { Table, Row } from 'react-bootstrap';

/**
 * This functional component shows items inside an order
 * @param {*} props {products}
 *  - product is a custom object containing all the useful iformation to descibe a product
 */
function OrderTable(props) {
  const productList = !props.products
    ? 0
    : props.products.map((product, k) => {
        return (
          <tr key={k}>
            <td>{product.name}</td>
            <td>{product.quantity}</td>
            <td>
              {product.price.toFixed(2)} €/{product.unit}
            </td>
            <td>{(product.quantity * product.price).toFixed(2)} €</td>
          </tr>
        );
      });

  /**
   * This function computes the total as product quantity times the unit price
   * @param {*} products
   *  - the list of the products
   * @returns the total amount of the product
   */
  function computeTotal(products) {
    if (!products || !products.length) {
      return 0;
    }

    return products
      .map((p) => p.quantity * p.price)
      .reduce((a, b) => a + b)
      .toFixed(2);
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
        <h4>Total € {computeTotal(props.products)}</h4>
      </Row>
    </>
  );
}

export default OrderTable;
