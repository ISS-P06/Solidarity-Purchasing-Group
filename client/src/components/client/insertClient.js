import { useState } from 'react';
import { Row, Col, Form, Button, Container } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import { Eye } from 'react-bootstrap-icons';
import {insertClient , insertUser} from '../../Api';

const InsertClient = function (props) {
    const {loggedIn} = props;
    /* if loggedIn is true, the shop employee insert the information for a client. Otherwise it's the client that registers himself*/

    const [passwordType, setPasswordType] = useState('password');
    const history = useHistory();

    const handleSubmit = (values) => {
        //console.log(values);
        let user = {};
        const typeUser = values.typeUser;
        if (typeUser === "client") {
            user = {
                typeUser: typeUser,
                name: values.name,
                surname: values.surname,
                phone: values.phone,
                address: values.address,
                mail: values.mail,
                balance: values.balance
            }
        } else if (typeUser === "farmer") {
            user = {
                typeUser: typeUser,
                name: values.name,
                surname: values.surname,
                phone: values.phone,
                address: values.address,
                mail: values.mail,
                farmName: values.farmName,
                username : values.username,
                password : values.password
            }
        } else if (typeUser === "shop_employee") {
            user = {
                typeUser: typeUser,
                name: values.name,
                surname: values.surname,
                phone: values.phone,
                mail: values.mail,
                username : values.username,
                password : values.password
            }
        }
        if(loggedIn){
            insertClient(values)
                .then(() => {
                    history.push('/'); /*TODO redirect in the correct home page*/
                    addMessage("", 'Registration is completed with success', 'success');

                })
                .catch((err) => {
                    addMessage("Error", err.message, 'danger');
                    console.log(err);
                });
        }else{
            switch (values.typeUser){
                case 'client':
                    insertClient(values)
                        .then(() => {
                            history.push('/'); /*TODO redirect in the correct home page*/
                            addMessage("", 'Registration is completed with success', 'success');

                        })
                        .catch((err) => {
                            addMessage("Error", err.message, 'danger');
                            console.log(err);
                        });
                    break;

                default:
                    insertUser(user)
                        .then(() => {
                            history.push('/'); /*TODO redirect in the correct home page*/
                            addMessage("", 'Registration is completed with success', 'success');
                        })
                        .catch(err=>{
                            addMessage("Error", err.message, 'danger');
                            console.log(err);
                        })
            }

        }
    };

    const formik = useFormik({
        initialValues: {
            typeUser: "client",
            name: '',
            surname: '',
            phone: '',
            address: '',
            mail: '',
            balance: '',
            username: '',
            password: '',
            farmName: ""
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            surname: Yup.string().required('Surname is required'),
            phone: Yup.string()
                .required('Phone number is required')
                .min(9, 'Phone number should be larger than 8 digits')
                .max(13, 'Phone number should be less than 14 digits'),
            mail: Yup.string().required('Email address is required'),
            typeUser: Yup.string(),
            balance: Yup.number().when('typeUser', {
                is: "client",
                then: Yup.number().required('Balance is required').positive('Balance should be positive').integer(),
                otherwise: Yup.number(),
            }),

            address: Yup.string().when('typeUser', {
                is: "client" || "shop_employee",
                then: Yup.string().required('Address is required'),
                otherwise: Yup.string(),
            }),
            username: Yup.string().required('Username is required'),
            password: Yup.string()
                .required('Password is required')
                .min(8, 'Password should be at least 8 characters'),
            farmName: Yup.string().when('typeUser', {
                is: "farmer",
                then: Yup.string().required('Farm name is required'),
                otherwise: Yup.string(),
            }),
        }),
        onSubmit: handleSubmit,
    });
    return (
        <Container>
            <Row className="justify-content-center">
                <Col sm={10} lg={8}>
                    <h3 className="mt-3">{loggedIn ? "Register new client" : "Register"}</h3>
                    <Form onSubmit={formik.handleSubmit}>
                        <h4 className="mt-3">{loggedIn ? "Information about the client" : "Your information"}</h4>
                        <Row className="m-2">
                            <Form.Group as={Col} xs="12" md="6" controlId="name">
                                <Form.Label className={'float-sm-start'}>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Mario"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    isInvalid={formik.touched.name && formik.errors.name}
                                />
                                <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} xs="12" md="6" controlId="surname">
                                <Form.Label className={'float-sm-start'}>Surname</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Rossi"
                                    value={formik.values.surname}
                                    onChange={formik.handleChange}
                                    isInvalid={formik.touched.surname && formik.errors.surname}
                                />
                                <Form.Control.Feedback type="invalid">{formik.errors.surname}</Form.Control.Feedback>
                            </Form.Group>

                        </Row>

                        <Row className="m-2">
                            <Form.Group as={Col} xs="12" md="6" controlId="mail">
                                <Form.Label className={'float-sm-start'}>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={formik.values.mail}
                                    onChange={formik.handleChange}
                                    isInvalid={formik.touched.mail && formik.errors.mail}
                                    placeholder="example@domain"
                                />
                                <Form.Control.Feedback type="invalid">{formik.errors.mail}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} xs="12" md="6" controlId="phone">
                                <Form.Label className={'float-sm-start'}>Phone number</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                    isInvalid={formik.touched.phone && formik.errors.phone}
                                    placeholder="3333333333"
                                />
                                <Form.Control.Feedback type="invalid">{formik.errors.phone}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>


                        <Row className="m-2">
                            { //Only for client or farmer
                                formik.values.typeUser === "client" || formik.values.typeUser === "farmer" ?
                                    <Form.Group as={Col} xs="12" md="6" controlId="address">
                                        <Form.Label className={'float-sm-start'}>Address </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formik.values.address}
                                            onChange={formik.handleChange}
                                            isInvalid={formik.touched.address && formik.errors.address}
                                            placeholder="via Paolo, 11, Torino"
                                        />
                                        <Form.Control.Feedback
                                            type="invalid">{formik.errors.address}</Form.Control.Feedback>
                                    </Form.Group>
                                    : <></>}

                            {formik.values.typeUser === "client" ?
                                <Form.Group as={Col} xs="12" md="6" controlId="balance">
                                    <Form.Label className={'float-sm-start'}>Balance </Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="5"
                                        value={formik.values.balance}
                                        onChange={formik.handleChange}
                                        isInvalid={formik.touched.balance && formik.errors.balance}
                                        placeholder="0.0"
                                    />
                                    <Form.Control.Feedback
                                        type="invalid">{formik.errors.balance}</Form.Control.Feedback>
                                </Form.Group>
                                : formik.values.typeUser === "farmer" ?
                                    <Form.Group as={Col} xs="12" md="6" controlId="farmName">
                                        <Form.Label className={'float-sm-start'}>Name of the farm </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formik.values.farmName}
                                            onChange={formik.handleChange}
                                            isInvalid={formik.touched.farmName && formik.errors.farmName}
                                        />
                                        <Form.Control.Feedback
                                            type="invalid">{formik.errors.farmName}</Form.Control.Feedback>
                                    </Form.Group>

                                    : <></>}
                        </Row>
                        <h4 className="mt-3">Credentials for authentication</h4>

                        <Row className="m-2">
                            <Form.Group as={Col} xs="12" md="6" controlId="username">
                                <Form.Label className={'float-sm-start'}>Username </Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                    isInvalid={formik.touched.username && formik.errors.username}
                                />
                                <Form.Control.Feedback
                                    type="invalid">{formik.errors.username}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} xs="12" md="6" controlId="password">
                                <Form.Label className={'float-sm-start'}>Password </Form.Label>
                                <Form.Control
                                    type={passwordType}
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    isInvalid={formik.touched.password && formik.errors.password}
                                />
                                <i
                                    className="float-md-start"
                                    id="password"
                                    onMouseDown={() =>
                                        setPasswordType((old) => (old === 'password' ? 'text' : 'password'))
                                    }
                                    onMouseUp={() => setPasswordType((old) => (old === 'text' ? 'password' : 'text'))}>
                                    <Eye/>
                                    <span> Show</span>{' '}
                                </i>

                                <Form.Control.Feedback
                                    type="invalid">{formik.errors.password}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        {!loggedIn ?

                            <Row className="m-2">
                                <Form.Group as={Col} xs="12" md="6" controlId="typeUser">
                                    <Form.Label className={'float-sm-start'}>
                                        Select a type of user
                                    </Form.Label>

                                    <Form.Select
                                        value={formik.values.typeUser}
                                        onChange={formik.handleChange}
                                        aria-label="Type of User">
                                        <option value="client"> Client</option>
                                        <option value="shop_employee"> Shop Employee</option>
                                        <option value="farmer"> Farmer</option>
                                    </Form.Select>
                                </Form.Group>
                            </Row>
                            : <></>} {/*the shop employee register the user if nobody is registered*/}


                        <Row className={'justify-content-between m-5'}>
                            <Col xs={4}>
                                <Link to="/" style={{textDecoration: 'none'}}>
                                    <Button className="btn-danger" size="lg">Cancel</Button>
                                </Link>
                            </Col>
                            <Col xs={4}>
                                <Button className="btn" size="lg" type="submit">
                                    Submit
                                </Button>
                            </Col>
                        </Row>

                    </Form>
                </Col>
      </Row>
    </Container>
  );
};
export default InsertClient;
