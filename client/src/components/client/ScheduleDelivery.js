import {useEffect, useState} from "react";
import {Button, Container, Form, InputGroup, Modal, Col} from "react-bootstrap";
import {useFormik} from "formik";
import * as Yup from 'yup'
import {api_scheduleDelivery} from '../../Api'
import {addMessage} from "../Message";
import dayjs from "dayjs";

function ScheduleDelivery(props) {
    const {orderID, show, setShow, virtualTime, handleCloseBasketCanvas} = props;
    const [wednesday, setWednesday] = useState('')
    const [friday, setFriday] = useState('')


    useEffect(async () => {
        let date = dayjs(virtualTime);

        for (let i = 0; i < 7; i++) {
            if (date.day() === 3) {
                setWednesday(date.format("YYYY-MM-DD").toString());
            }
            if (date.day() === 5) {
                setFriday(date.format("YYYY-MM-DD").toString());
            }
            date = date.add(1, 'day')
        }
    }, [virtualTime])

    const handleSubmit = (values) => {
        let delivery = {
            typeDelivery: values.typeDelivery,
            address: values.address,
            date: values.date,
            startTime: values.startTime,
            endTime: values.endTime
        }
        api_scheduleDelivery(orderID, delivery)
            .then(() => {
                addMessage({title: "", message: 'Scheduling delivery completed with success', type: 'success'})
               handleCloseBasketCanvas(); //close the basket modal
            }).catch((err) => {
            addMessage({title: "Error", message: err.message, type: 'danger'});
        })
        handleClose();
    }

    const handleClose = () => {
        setShow(false)
    }



    const changeTypeDelivery = (event) => {
        formik.setFieldValue("typeDelivery", event.target.id)
    }
    const formik = useFormik({
        initialValues: {
            typeDelivery: "home",
            date: dayjs(virtualTime).add(4, 'day').format("YYYY-MM-DD").toString(),
            startTime: '08:00',
            endTime:'09:00',
            address: ''
        },
        validationSchema: Yup.object({
            address: Yup.string().when('typeDelivery', {
                is: "home",
                then: Yup.string().required('Address is required'),
                otherwise: Yup.string(),
            }),
            startTime: Yup.string().required('Time is required'),
            endTime: Yup.string().required('Time is required'),
            date: Yup.string().required('Date is required'),
        }),
        onSubmit: handleSubmit,
    })


    return (

        <Modal show={show} onHide={handleClose}  backdrop="static"   aria-labelledby="contained-modal-title-vcenter">

            <Modal.Header closeButton={false}>
                <Container className="justify-content-between offset-md-3">
                    <Modal.Title>Schedule delivery</Modal.Title>
                </Container>
            </Modal.Header>

            <Modal.Body className="text-center">
                <Form onSubmit={formik.handleSubmit}>
                    <Col className="mb-2">
                        <Form.Check
                            inline
                            label="Delivery at home"
                            name="typeDelivery"
                            type="radio"
                            id="home"
                            onClick={changeTypeDelivery}
                            required
                            checked={formik.values.typeDelivery==="home"}
                        />
                        <Form.Check
                            inline
                            label="Pick up in store"
                            name="typeDelivery"
                            type="radio"
                            id="store"
                            required
                            onClick={changeTypeDelivery}
                            checked={formik.values.typeDelivery==="store"}
                        />
                    </Col>

                    <InputGroup controlID={'Date'}>
                        <InputGroup.Text>Date</InputGroup.Text>
                        <Form.Control id="date" data-testid="date-element" type='date' value={formik.values.date}
                                      onChange={formik.handleChange}
                                      isInvalid={formik.touched.date && formik.errors.date}
                                      min={wednesday}
                                      max={friday}
                                      required
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.date}</Form.Control.Feedback>
                    </InputGroup>

                    <InputGroup controlID={'startTime'} className={'mt-4'}>
                        <InputGroup.Text>From </InputGroup.Text>
                        <Form.Control id="startTime" data-testid="startTime-element" type='time' value={formik.values.startTime}
                                      onChange={formik.handleChange}
                                      min={"08:00"}
                                      max={formik.values.endTime}
                                      isInvalid={formik.touched.startTime && formik.errors.startTime}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.startTime}</Form.Control.Feedback>
                    </InputGroup>
                    <InputGroup controlID={'endTime'} className={'mt-4'}>
                        <InputGroup.Text>To</InputGroup.Text>
                        <Form.Control id="endTime" data-testid="endTime-element" type='time' value={formik.values.endTime}
                                      onChange={formik.handleChange}
                                      min={formik.values.startTime}
                                      max={"20:00"}
                                      isInvalid={formik.touched.endTime && formik.errors.endTime}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.endTime}</Form.Control.Feedback>
                    </InputGroup>

                    {formik.values.typeDelivery === "home" && //only for delivery at home
                    <>
                        <InputGroup controlID={'address'} className={'mt-4'}>
                            <InputGroup.Text>Address</InputGroup.Text>
                            <Form.Control id="address" data-testid="address-element" type='text'
                                          value={formik.values.address} onChange={formik.handleChange}
                                          isInvalid={formik.touched.address && formik.errors.address}
                            />
                            <Form.Control.Feedback type="invalid">{formik.errors.address}</Form.Control.Feedback>
                        </InputGroup>
                        <p className="mt-1">If you choose to delivery at home, you will pay an extra fee!</p>
                    </>
                    }


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