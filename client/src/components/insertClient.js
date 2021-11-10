import {Row, Col, Form, Button} from "react-bootstrap";
import {useFormik} from "formik";
import * as Yup from 'yup';
import {Link} from "react-router-dom";

const InsertClient = function (props) {
    const handleSubmit = (values) => {
        console.log(values)
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            surname: '',
            phone: '',
            address: '',
            emailAddress: '',
            balance: 0,

        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            surname: Yup.string().required('surname is required'),
            phone: Yup.string().required('phone number is required')
                .min(9, 'phone number should be larger than 8 digits')
                .max(13, 'phone number should be less than 14 digits'),
            emailAddress: Yup.string().required('email address is required'),
            address: Yup.string().required('client address is required'),
        }),
        onSubmit: handleSubmit,
    })
    return (<>
        <Row>
            <Col sm={{span: '6', offset: '3'}}>
                <h1>Register new client</h1>
                <Form onSubmit={formik.handleSubmit}>
                    <Form.Group className="mb-3 mt-3" controlId="name">
                        <Form.Label className={'float-sm-start'}>Client name</Form.Label>
                        <Form.Control type="text" placeholder="Mario"
                                      value={formik.values.name}
                                      onChange={formik.handleChange}
                                      isInvalid={formik.touched.name && formik.errors.name}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="surname">
                        <Form.Label className={'float-sm-start'}>Client surname</Form.Label>
                        <Form.Control type="text" placeholder="Rossi"
                                      value={formik.values.surname}
                                      onChange={formik.handleChange}
                                      isInvalid={formik.touched.surname && formik.errors.surname}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.surname}</Form.Control.Feedback>
                    </Form.Group>

                        <Form.Group className="mb-3" >
                        <Form.Label className={'float-sm-start'}>Email address</Form.Label>
                        <Form.Control id={"emailAddress"} type="email"
                                      value={formik.values.emailAddress}
                                      onChange={formik.handleChange}
                                      isInvalid={formik.touched.emailAddress && formik.errors.emailAddress}
                                      placeholder="example@domain"/>
                        <Form.Control.Feedback type="invalid">{formik.errors.emailAddress}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="phone">
                        <Form.Label className={'float-sm-start'}>Phone number</Form.Label>
                        <Form.Control type="text"
                                      value={formik.values.phone}
                                      onChange={formik.handleChange}
                                      isInvalid={formik.touched.phone && formik.errors.phone}
                                      placeholder="321111111"/>
                        <Form.Control.Feedback type="invalid">{formik.errors.phone}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="address">
                        <Form.Label className={'float-sm-start'}>Address </Form.Label>
                        <Form.Control type="text"
                                      value={formik.values.address}
                                      onChange={formik.handleChange}
                                      isInvalid={formik.touched.address && formik.errors.address}
                                      placeholder="via Paolo, 11, Torino"/>
                        <Form.Control.Feedback type="invalid">{formik.errors.address}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="balance">
                        <Form.Label className={'float-sm-start'}>Balance </Form.Label>
                        <Form.Control type="text"
                                      value={formik.values.balance}
                                      onChange={formik.handleChange}
                                      isInvalid={formik.touched.balance && formik.errors.balance}
                                      placeholder="0.0"
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.balance}</Form.Control.Feedback>
                    </Form.Group>

                    <Row className={'justify-content-between mb-5'}>
                        <Col>
                            <Link to="/" style={{textDecoration: 'none'}}>
                                <Button variant={"secondary"}>
                                    Cancel
                                </Button>
                            </Link>
                        </Col>
                        <Col>
                            <Button type="submit">
                                Submit
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Col>
        </Row>
    </>);
}
export default InsertClient