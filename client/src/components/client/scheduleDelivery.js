import {useEffect, useState} from "react";
import {Button, Col, Container, Form, InputGroup, Modal, Row} from "react-bootstrap";
import {useFormik} from "formik";
import * as Yup from 'yup'
import {api_scheduleDelivery, api_getTime} from '../../Api'
import {addMessage} from "../Message";
import dayjs from "dayjs";

function ScheduleDelivery(props) {
    const {orderID, show, setShow, virtualTime}= props;
    const [wednesday ,setWednesday] = useState('')
    const [friday ,setFriday] = useState('')
    const [dirty ,setDirty] = useState(false)



    useEffect(async()=>{
        let date = dayjs(virtualTime);
        console.log(date);

        for (let i = 0 ; i < 7 ;i++ ){
             if(date.day() === 3){
                 setWednesday( date.format("YYYY-MM-DD").toString());
             }
             if (date.day() === 5){
                 setFriday( date.format("YYYY-MM-DD").toString());
             }
            date = date.add(1 , 'day')
        }

        setDirty(old=> ! old)
    },[virtualTime])

    const handleSubmit = (values) => {
        let delivery = {
            address: values.address,
            date: values.date,
            time: values.time
        }
        api_scheduleDelivery(orderID, delivery)
            .then(() => {
                addMessage({title: "", message: 'Scheduling delivery completed with success', type: 'success'})
            }).catch((err) => {
            addMessage({title: "Error", message: err.message, type: 'danger'});
        })
        handleClose();
    }

    const handleClose = () => {
        setShow(false)
    }

    function handleShow() {
        setShow(true)
    }

    const formik = useFormik({
        initialValues: {
            date: dayjs().toString(),
            time: '',
            address: ''
        },
        validationSchema: Yup.object({
            address: Yup.string().required('address field is required'),
            time: Yup.string().required('time field is required'),
            date: Yup.string().required('date field is required'),
        }),
        onSubmit: handleSubmit,
    })


    return (

        <Modal show={show} onHide={handleClose}>

            <Modal.Header closeButton>
                <Container className="justify-content-between offset-md-3">
                    <Modal.Title>Schedule delivery</Modal.Title>
                </Container>
            </Modal.Header>

            <Modal.Body className="text-center">
                <Form onSubmit={formik.handleSubmit}>

                    <InputGroup controlID={'Date'}>
                        <InputGroup.Text>Date</InputGroup.Text>
                        <Form.Control id="date" data-testid="date-element" type='date' value={formik.values.date}
                                      onChange={formik.handleChange}
                                      isInvalid={formik.touched.date && formik.errors.date}
                                      min={wednesday}
                                      max={friday}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.date}</Form.Control.Feedback>
                    </InputGroup>

                    <InputGroup controlID={'Time'} className={'mt-4'}>
                        <InputGroup.Text>Time</InputGroup.Text>
                        <Form.Control id="time" data-testid="time-element" type='time' value={formik.values.time}
                                      onChange={formik.handleChange}
                                      min={"08:00"}
                                      max={"20:00"}
                                      isInvalid={formik.touched.time && formik.errors.time}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.time}</Form.Control.Feedback>
                    </InputGroup>

                    <InputGroup controlID={'address'} className={'mt-4'}>
                        <InputGroup.Text>Address</InputGroup.Text>
                        <Form.Control id="address" data-testid="address-element" type='text'
                                      value={formik.values.address} onChange={formik.handleChange}
                                      isInvalid={formik.touched.address && formik.errors.address}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.address}</Form.Control.Feedback>
                    </InputGroup>

                    <Modal.Footer>
                        <Container>

                            <Button data-testid="submit-element" className={'float-md-end btn'} type='submit'
                                    variant="success">Submit</Button>
                        </Container>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default ScheduleDelivery;