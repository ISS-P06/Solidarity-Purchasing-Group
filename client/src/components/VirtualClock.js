import { useEffect, useState } from "react";
import { Container, Col, Form, Row, Button, Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import TimePicker from 'react-bootstrap-time-picker';
import { api_setTime, api_getTime } from "../Api";

import "react-datepicker/dist/react-datepicker.css";

function VirtualClock(props) {
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(0);
    const [showModalVT, setShowModalVT] = useState(false);
    const handleClose = () => setShowModalVT(false);
    const handleShow = () => setShowModalVT(true);

    const handleDate = async () => {
        await setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        alert("Hai selezionato " + date + " ore: " + (time / 3600));
        api_setTime(date, time / 3600);
        handleClose();
    };

    useEffect(() => {

        const getTime = async () => {
          let new_date = await api_getTime();
          setDate(new Date(new_date.substring(0,4), (new_date.substring(5,7) - 1), new_date.substring(8,10)));
          setTime(new_date.substring(11,13));
        };
        
        getTime();

    
      }, []);

    const renderDate = () => {
        let d, weekDay;
        switch (date.getDay()) {
            case 0:
                weekDay = 'Sunday';
                break;
            case 1:
                weekDay = 'Monday';
                break;
            case 2:
                weekDay = 'Tuesday';
                break;
            case 3:
                weekDay = 'Wednesday';
                break;
            case 4:
                weekDay = 'Thursday';
                break;
            case 5:
                weekDay = 'Friday';
                break;
            case 6:
                weekDay = 'Saturday';
                break;
        }
        d = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " - " + weekDay;
        return d;
    }

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Virtual clock
            </Button>

            <Modal show={showModalVT} onHide = {handleClose}>
                <Modal.Header className="justify-content-center" closeButton>
                    <Modal.Title >Virtual clock</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col className="justify-content-center">
                                <Row>
                                    <Form.Label><b>Select the date</b></Form.Label>
                                </Row>
                                <Row flex className="align-items-center">
                                    <Col>
                                        {renderDate()}
                                    </Col>
                                    <Col>
                                        <Button onClick={() => handleDate()}>Next day</Button>
                                    </Col>
                                </Row>
                                <Row>
                                    <Form.Label><b>Select time</b></Form.Label>
                                </Row>
                                <Row>
                                    <Col />
                                    <Col>
                                        <TimePicker value={time} start="00:00" end="23:30" format={24} step={60} onChange={(time) => setTime(time)} />
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
