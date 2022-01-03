import { useState, useEffect, PureComponent } from 'react';
import { api_generateMonthlyReport, api_generateWeeklyReport } from "../../Api";
import dayjs from 'dayjs';
import { Form, Col, Button, Row, Container } from 'react-bootstrap';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Sector } from 'recharts';

function ManagerHomePage(props) {
  const { user } = props;
  const [x, setX] = useState("");

  const data = [
    { name: 'Delivered', number: 90 },
    { name: 'Undelivered', number: 10 },
  ];

  useEffect(() => {
    const date = dayjs(new Date("November, 16 2021 00:00:00")).format("YYYY-MM-DD HH:mm");
    api_generateMonthlyReport(date)
      .then((response) => {
        setX(response);

      })
      .catch((error) => {

      });
  }, []);

  return (<>
    <Container>
      <Row className="mb-3">
          <Col style={{display: 'flex', justifyContent: 'center'}}>
              <h3>Weekly report</h3>
          </Col>
      </Row>
      <Row>
        <Col>
          <h3 class="d-flex mb-3">Orders</h3>
          <div class="d-flex">Total orders: {x.totalOrders}</div>
          <div class="d-flex">Delivered orders: {x.totalOrders}</div>
          <div class="d-flex">Undelivered orders: {x.totalOrders}</div>

          <div class="d-flex">Percentage of undelivered orders: {x.perc_undeliveredOrd}</div>
          <div class="d-flex">Percentage of delivered orders: {x.perc_deliveredOrd}</div>
        </Col>
        <Col>
          <MyBarChart data={data} />
        </Col>
        <Col>
          <MyPieChart data={data} />
        </Col>
      </Row>
      <Row>
        <Col>
          <h3 class="d-flex mb-3">Food</h3>
          <div class="d-flex">Total food: {x.totalFood}</div>
          <div class="d-flex">Delivered food: {x.deliveredFood}</div>
          <div class="d-flex">Undelivered food: {x.undeliveredFood}</div>

          <div class="d-flex">Percentage of undelivered food: {x.perc_undeliveredFood}</div>
          <div class="d-flex">Percentage of delivered food: {x.perc_deliveredFood}</div>
        </Col>
        <Col>
          <MyBarChart data={data} />
        </Col>
        <Col>
          <MyPieChart data={data} />
        </Col>
      </Row>
    </Container>
  </>);
}

function MyBarChart(props) {
  const { data } = props;
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar name="Number of orders" dataKey="number" fill="#499F36" isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}


function MyPieChart(props) {

  const { data } = props;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={400} height={400}>
        <Pie
          dataKey="number"
          isAnimationActive={false}
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#499F36"
          label
        />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default ManagerHomePage;
