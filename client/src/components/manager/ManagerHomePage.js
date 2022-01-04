import { useState, useEffect } from 'react';
import { api_generateMonthlyReport, api_generateWeeklyReport, api_getTime } from "../../Api";
import dayjs from 'dayjs';
import { Col, Row, Container } from 'react-bootstrap';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie } from 'recharts';
import { Card, Table, Form, InputGroup } from 'react-bootstrap';

function ManagerHomePage(props) {
  const { user, type, virtualTime } = props;
  const [x, setX] = useState("");
  const [y, setY] = useState((dayjs(virtualTime)).format("YYYY-MM-DD"));
  const cardHeight = '14.5rem';

  /*
  DUMMY STATS
  let abc = {
    totalOrders: 100,
    deliveredOrders: 90,
    undeliveredOrders: 10,
    totalFood: 100,
    deliveredFood: 75,
    undeliveredFood: 25,
    perc_undeliveredOrd: 0.1,
    perc_deliveredOrd: 0.9,
    perc_undeliveredFood: 0.25,
    perc_deliveredFood: 0.75,
  }
  */

  useEffect(() => {
    if (y !== (dayjs(virtualTime)).format("YYYY-MM-DD")) {
      api_generateWeeklyReport(dayjs(y).format("YYYY-MM-DD HH:mm"))
        .then((response) => {
          setX(response);
        })
        .catch((error) => {

        });
    }
  }, [y]);

  return (<>
    <Container className="mt-0">
      <Row className="mb-3">
        <Col style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ paddingRight: 15 }}><h3>{type} report for date: </h3></div>
          <Form>
            <InputGroup>
              <Form.Control type="date" value={y} onChange={(e) => setY(e.target.value)}></Form.Control>
            </InputGroup>
          </Form>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={12} xl={4}>
          <Card bg="light" text="black" className="shadow p-3" style={{ height: cardHeight }}>
            <StatisticsTable stats={x} type="Orders" />
          </Card>
        </Col>
        <Col md={12} xl={4}>
          <Card bg="light" text="black" className="shadow" style={{ height: cardHeight }}>
            <CustomBarChart stats={x} type="Orders" />
          </Card>
        </Col>
        <Col md={12} xl={4}>
          <Card bg="light" text="black" className="shadow" style={{ height: cardHeight }}>
            <CustomPieChart stats={x} type="Orders" />
          </Card>
        </Col>
      </Row>
      <Row className="mb-0">
        <Col md={12} xl={4}>
          <Card bg="light" text="black" className="shadow p-3" style={{ height: cardHeight }}>
            <StatisticsTable stats={x} type="Food" />
          </Card>
        </Col>
        <Col md={12} xl={4}>
          <Card bg="light" text="black" className="shadow" style={{ height: cardHeight }}>
            <CustomBarChart stats={x} type="Food" />
          </Card>
        </Col>
        <Col md={12} xl={4}>
          <Card bg="light" text="black" className="shadow" style={{ height: cardHeight }}>
            <CustomPieChart stats={x} type="Food" />
          </Card>
        </Col>
      </Row>
    </Container>
  </>);
}

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

function CustomBarChart(props) {
  const { stats, type } = props;
  const COLORS = ['#499f36', '#38782a'];

  let labelText;
  let delivered, undelivered;
  if (type === "Orders") {
    if (!stats.totalOrders) {
      return <div className="p-5">No orders data available.</div>;
    }
    labelText = "Number of orders";
    delivered = stats.deliveredOrders;
    undelivered = stats.undeliveredOrders;
  } else if (type === "Food") {
    if (!stats.totalFood) {
      return <div className="p-5">No food data available.</div>;
    }
    labelText = "Quantity of food (Kg)";
    delivered = stats.deliveredFood;
    undelivered = stats.undeliveredFood;
  }
  const data = [
    { name: 'Delivered', value: delivered },
    { name: 'Undelivered', value: undelivered },
  ];

  return (
    <ResponsiveContainer width="95%" height="90%" className="pt-3">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar name={labelText} dataKey="value" isAnimationActive={false}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}


function CustomPieChart(props) {
  const { stats, type } = props;
  const COLORS = ['#499f36', '#38782a'];

  let labelText;
  let delivered, undelivered;
  if (type === "Orders") {
    if (!stats.totalOrders) {
      return <div className="p-5">No orders data available.</div>;
    }
    labelText = " orders (%)";
    delivered = stats.perc_deliveredOrd * 100;
    undelivered = stats.perc_undeliveredOrd * 100;
  } else if (type === "Food") {
    if (!stats.totalFood) {
      return <div className="p-5">No food data available.</div>;
    }
    labelText = " food (%)";
    delivered = stats.perc_deliveredFood * 100;
    undelivered = stats.perc_undeliveredFood * 100;
  }
  const data = [
    { name: 'Delivered' + labelText, number: delivered },
    { name: 'Undelivered' + labelText, number: undelivered },
  ];

  return (
    <ResponsiveContainer width="90%" height="90%">
      <PieChart>
        <Pie
          dataKey="number"
          isAnimationActive={false}
          data={data}
          cx="55%"
          cy="55%"
          outerRadius={70}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default ManagerHomePage;
