import { Table } from 'react-bootstrap';

function StatisticsTable(props) {
  const { stats, type } = props;
  const leftSpace = 10;

  let tot, del, und, pdel, pund;
  if (type === "Orders") {
    tot = stats.totalOrders ? stats.totalOrders : 0;
    del = stats.deliveredOrders ? stats.deliveredOrders : 0;
    und = stats.undeliveredOrders ? stats.undeliveredOrders : 0;
    pdel = stats.perc_deliveredOrd ? stats.perc_deliveredOrd * 100 + " %" : 0 + " %";
    pund = stats.perc_undeliveredOrd ? stats.perc_undeliveredOrd * 100 + " %" : 0 + " %";
  } else if (type === "Food") {
    tot = stats.totalFood ? stats.totalFood + " Kg" : 0 + " Kg";
    del = stats.deliveredFood ? stats.deliveredFood + " Kg" : 0 + " Kg";
    und = stats.undeliveredFood ? stats.undeliveredFood + " Kg" : 0 + " Kg";
    pdel = stats.perc_deliveredFood ? stats.perc_deliveredFood * 100 + " %" : 0 + " %";
    pund = stats.perc_undeliveredFood ? stats.perc_undeliveredFood * 100 + " %" : 0 + " %";
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
