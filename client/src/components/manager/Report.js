import { api_generateMonthlyReport, api_generateWeeklyReport } from "../../Api";
import { Col, Row, Container, Card, Form, InputGroup } from 'react-bootstrap';
import StatisticsTable from './StatisticsTable';
import CustomBarChart from './CustomBarChart';
import CustomPieChart from './CustomPieChart';
import { useState, useEffect } from 'react';
import { addMessage } from "../Message";
import dayjs from 'dayjs';

// A report page for orders and food stats
// It can bee Weekly or Monthly
function Report(props) {
  const { type, virtualTime } = props;
  const [stats, setStats] = useState("");
  const [date, setDate] = useState((dayjs(virtualTime)).format("YYYY-MM-DD"));
  const cardHeight = '14.5rem';

  // select correct API
  let api_generateReport;
  if (type === "Weekly") {
    api_generateReport = api_generateWeeklyReport;
  } else if (type === "Monthly") {
    api_generateReport = api_generateMonthlyReport;
  }

  // stats generation
  useEffect(() => {
    if (date !== "") {
      api_generateReport(dayjs(date).format("YYYY-MM-DD HH:mm"))
        .then((response) => {
          setStats(response);
        })
        .catch((error) => {
          addMessage({ message: 'An error occurred during the report generation', type: 'danger' });
        });
    } else {
      setStats("");
    }
    // eslint-disable-next-line
  }, [date]);

  return (<>
    <Container className="mt-0">
      <Row className="mb-3">
        <Col style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ paddingRight: 15 }}><h3>{type} report for date:</h3></div>
          <Form>
            <InputGroup>
              <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)}></Form.Control>
            </InputGroup>
          </Form>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={12} xl={4}>
          <Card bg="light" text="black" className="shadow p-3" style={{ height: cardHeight }}>
            <StatisticsTable stats={stats} type="Orders" />
          </Card>
        </Col>
        <Col md={12} xl={4}>
          <Card bg="light" text="black" className="shadow" style={{ height: cardHeight }}>
            <CustomBarChart stats={stats} type="Orders" />
          </Card>
        </Col>
        <Col md={12} xl={4}>
          <Card bg="light" text="black" className="shadow" style={{ height: cardHeight }}>
            <CustomPieChart stats={stats} type="Orders" />
          </Card>
        </Col>
      </Row>
      <Row className="mb-0">
        <Col md={12} xl={4}>
          <Card bg="light" text="black" className="shadow p-3" style={{ height: cardHeight }}>
            <StatisticsTable stats={stats} type="Food" />
          </Card>
        </Col>
        <Col md={12} xl={4}>
          <Card bg="light" text="black" className="shadow" style={{ height: cardHeight }}>
            <CustomBarChart stats={stats} type="Food" />
          </Card>
        </Col>
        <Col md={12} xl={4}>
          <Card bg="light" text="black" className="shadow" style={{ height: cardHeight }}>
            <CustomPieChart stats={stats} type="Food" />
          </Card>
        </Col>
      </Row>
    </Container>
  </>);
}

export default Report;
