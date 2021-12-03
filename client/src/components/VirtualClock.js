import { useEffect, useState } from 'react';
import { Col, Form, Row, Button, Modal } from 'react-bootstrap';

import TimePicker from 'react-bootstrap-time-picker';

import { api_setTime } from '../Api';
import { humanToISO, ISOtoHuman } from '../utils';

function VirtualClock(props) {
  const setDirtyVT = props.setDirtyVT;
  const virtualTime = props.virtualTime;
  const dirtyVT = props.dirtyVT;

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(0);
  const [showModalVT, setShowModalVT] = useState(false);

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleClose = () => setShowModalVT(false);
  const handleShow = () => setShowModalVT(true);

  const handleDate = async () => {
    const newDate = new Date();
    newDate.setDate(date.getDate() + 1);

    setDate(newDate);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(virtualTime);
    const ISODate = humanToISO(date, time);
    await api_setTime(ISODate).catch(() => {});

    setDirtyVT(true);

    handleClose();
  };

  useEffect(() => {
    if (!dirtyVT) {
      const humanTime = ISOtoHuman(virtualTime.toISOString());

      setDate(humanTime.date);
      setTime(humanTime.time); 
    }       
  }, [dirtyVT]);

  const renderDate = () => {
    const day = weekdays[date.getDay()];
    const fullDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

    return fullDate + ' - ' + day;
  };

  return (
    <>
      <Button variant="success" onClick={handleShow}>
        Virtual clock
      </Button>

      <Modal show={showModalVT} onHide={handleClose}>
        <Modal.Header className="justify-content-center" closeButton>
          <Modal.Title>Virtual clock</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col className="justify-content-center">
                <Row>
                  <Form.Label>
                    <b>Select the date</b>
                  </Form.Label>
                </Row>
                <Row flex="true" className="align-items-center">
                  <Col>{renderDate()}</Col>
                  <Col>
                    <Button onClick={() => handleDate()}>Next day</Button>
                  </Col>
                </Row>
                <Row>
                  <Form.Label>
                    <b>Select time</b>
                  </Form.Label>
                </Row>
                <Row>
                  <Col />
                  <Col>
                    <TimePicker
                      value={time * 3600}
                      start="00:00"
                      end="23:30"
                      format={24}
                      step={60}
                      onChange={(t) => setTime(t/3600)}
                    />
                  </Col>
                  <Col />
                </Row>
                <hr />
                <Row>
                  <Col>
                    <Button variant="primary" type="onSubmit">
                      Update Virtual clock
                    </Button>
                  </Col>
                  <Col>
                    <Button variant="danger" onClick={() => setDate(new Date())}>
                      Reset
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default VirtualClock;
