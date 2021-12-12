import {useState} from "react";
import {Button, Col, Container, Form, InputGroup, Modal, Row} from "react-bootstrap";
import {useFormik} from "formik";
import * as Yup from 'yup'
import {api_scheduleDelivery} from '../../Api'
import {addMessage} from "../Message";


function ScheduleDelivery(props) {
    const orderID = props.orderID
    const [showModal, setShowModal] = useState(false);


    const handleSubmit = (values) => {
        let delivery ={
            address : values.address,
            date : values.date,
            time : values.time
        }
        api_scheduleDelivery(orderID , delivery)
            .then(()=>{
                addMessage({title: "", message: 'Scheduling delivery completed with success', type: 'success'})
            }).catch((err)=>{
            addMessage({title: "Error", message: err.message, type: 'danger'});
        })
        handleClose();
    }

    const handleClose = () => {
        setShowModal(false)
    }

    function handleShow() {
        setShowModal(true)
    }

    const formik = useFormik({
        initialValues: {
            date: '',
            time : '',
            address: ''
        },
        validationSchema: Yup.object({
        address: Yup.string().required('address field is required'),
        time: Yup.string().required('time field is required'),
        date: Yup.string().required('date field is required'),
    }),
        onSubmit: handleSubmit,
    })


    return (<>
        <Button className="float-md-start text-light m-0 pt-1 pb-1" variant="success" onClick={handleShow}>
            Schedule delivery
        </Button>
        <Modal show={showModal} onHide={handleClose}>

            <Modal.Header closeButton>
                <Container className="justify-content-between offset-md-3" >
                    <Modal.Title>Schedule delivery</Modal.Title>
                </Container>
            </Modal.Header>

            <Modal.Body className="text-center">
                <Form onSubmit={formik.handleSubmit}>

                    <InputGroup controlID={'Date'}>
                        <InputGroup.Text>Date</InputGroup.Text>
                        <Form.Control id="date" data-testid="date-element" type='date' value={formik.values.date} onChange={formik.handleChange}
                                      isInvalid={formik.touched.date && formik.errors.date}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.date}</Form.Control.Feedback>
                    </InputGroup>

                    <InputGroup controlID={'Time'} className={'mt-4'}>
                        <InputGroup.Text>Time</InputGroup.Text>
                        <Form.Control id="time" data-testid="time-element" type='time' value={formik.values.time} onChange={formik.handleChange}
                                      isInvalid={formik.touched.time && formik.errors.time}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.time}</Form.Control.Feedback>
                    </InputGroup>

                    <InputGroup controlID={'address'} className={'mt-4'}>
                        <InputGroup.Text>Address</InputGroup.Text>
                        <Form.Control id="address" data-testid="address-element" type='text' value={formik.values.address} onChange={formik.handleChange}
                                      isInvalid={formik.touched.address && formik.errors.address}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.address}</Form.Control.Feedback>
                    </InputGroup>

                    <Modal.Footer>
                        <Container>
                        <Button data-testid="close-element" className={'float-md-start'} variant="danger" onClick={handleClose}>
                            Close
                        </Button>
                        <Button data-testid="submit-element" className={'float-md-end btn'} type='submit' variant="success">Submit</Button>
                        </Container>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    </>);
}

export default ScheduleDelivery;