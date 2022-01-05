import { Table } from 'react-bootstrap';

// A table to display orders and food statistics
function StatisticsTable(props) {
  const { stats, type } = props;
  const leftSpace = 10;

  // format stats
  function checkNumber(value) {
    return value ? value : 0;
  }
  function checkPercentage(value) {
    return value ? value*100 : 0;
  }

  // prepare table data from stats
  let tot, del, und, pdel, pund;
  if (type === "Orders") {
    tot = checkNumber(stats.totalOrders);
    del = checkNumber(stats.deliveredOrders);
    und = checkNumber(stats.undeliveredOrders);
    pdel = checkPercentage(stats.perc_deliveredOrd)+" %";
    pund = checkPercentage(stats.perc_undeliveredOrd)+" %";
  } else if (type === "Food") {
    tot = checkNumber(stats.totalFood)+" Kg";
    del = checkNumber(stats.deliveredFood)+" Kg";
    und = checkNumber(stats.undeliveredFood)+" Kg";
    pdel = checkPercentage(stats.perc_deliveredFood)+" %";
    pund = checkPercentage(stats.perc_undeliveredFood)+" %";
  }

  return (
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <td className="text-start" style={{ paddingLeft: leftSpace }}><b>{type}</b></td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="text-start" style={{ paddingLeft: leftSpace }}>Total</td>
          <td>{tot}</td>
        </tr>
        <tr>
          <td className="text-start" style={{ paddingLeft: leftSpace }}>Delivered</td>
          <td>{del}</td>
        </tr>
        <tr>
          <td className="text-start" style={{ paddingLeft: leftSpace }}>Undelivered</td>
          <td>{und}</td>
        </tr>
        <tr>
          <td className="text-start" style={{ paddingLeft: leftSpace }}>Percentage delivered</td>
          <td>{pdel}</td>
        </tr>
        <tr className="p-0">
          <td className="text-start" style={{ paddingLeft: leftSpace }}>Percentage undelivered</td>
          <td>{pund}</td>
        </tr>
      </tbody>
    </Table>
  );
}

export default StatisticsTable;
