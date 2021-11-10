import { useEffect, useState } from "react";
import { Container, Col, Form, Row, Button, Modal } from "react-bootstrap";

import TimePicker from 'react-bootstrap-time-picker';




import { api_setTime, api_getTime } from "../Api";
import { humanToISO, ISOtoHuman } from "../utils";

import "react-datepicker/dist/react-datepicker.css";

function VirtualClock(props) {
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(0);
    const [showModalVT, setShowModalVT] = useState(false);


    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const handleClose = () => setShowModalVT(false);
    const handleShow = () => setShowModalVT(true);

    const handleDate = async () => {
        const newDate = new Date()
        newDate.setDate(date.getDate() +1)
        
        setDate(newDate)
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const ISODate = humanToISO(date, time/3600);
        api_setTime(ISODate);

        handleClose();
    };

    useEffect(() => {

        const getTime = async () => {
          const apiData = await api_getTime();
        //   const day = apiData.day

          const {date, time} = ISOtoHuman(apiData.currentTime)
            
          setDate(date);
          setTime(time);
        };
        
        getTime();

    
      }, []);

    const renderDate=()=> {
        const day = weekdays[date.getDay()]
        const fullDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()

        return  fullDate + " - " + day;
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
