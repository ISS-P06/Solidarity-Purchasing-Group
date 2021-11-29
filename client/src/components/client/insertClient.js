import { useState } from 'react';
import { Row, Col, Form, Button, Container } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import { Eye } from 'react-bootstrap-icons';

import { insertClient } from '../../Api';

const InsertClient = function (props) {
  const [passwordType, setPasswordType] = useState('password');
  const history = useHistory();

  const handleSubmit = (values) => {
    insertClient(values)
      .then(() => {
        history.push('/');
      })
      .catch((err) => console.log(err));
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      surname: '',
      phone: '',
      address: '',
      mail: '',
      balance: '',
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      surname: Yup.string().required('surname is required'),
      phone: Yup.string()
        .required('phone number is required')
        .min(9, 'phone number should be larger than 8 digits')
        .max(13, 'phone number should be less than 14 digits'),
      mail: Yup.string().required('email address is required'),
      address: Yup.string().required('client address is required'),
      username: Yup.string().required('user name is required'),
      password: Yup.string()
        .required('password is required')
        .min(8, 'password should be at least 8 characters'),
    }),
    onSubmit: handleSubmit,
  });
  return (
    <Container>
      <Row className="justify-content-center">
        <Col sm={8} lg={5}>
          <h3 className="mt-3">Register new client</h3>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3 mt-3" controlId="name">
              <Form.Label className={'float-sm-start'}>Client name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Mario"
                value={formik.values.name}
                onChange={formik.handleChange}
                isInvalid={formik.touched.name && formik.errors.name}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="surname">
              <Form.Label className={'float-sm-start'}>Client surname</Form.Label>
              <Form.Control
                type="text"
                placeholder="Rossi"
                value={formik.values.surname}
                onChange={formik.handleChange}
                isInvalid={formik.touched.surname && formik.errors.surname}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.surname}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="mail">
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

            <Form.Group className="mb-3" controlId="phone">
              <Form.Label className={'float-sm-start'}>Phone number</Form.Label>
              <Form.Control
                type="text"
                value={formik.values.phone}
                onChange={formik.handleChange}
                isInvalid={formik.touched.phone && formik.errors.phone}
                placeholder="321111111"
              />
              <Form.Control.Feedback type="invalid">{formik.errors.phone}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="address">
              <Form.Label className={'float-sm-start'}>Address </Form.Label>
              <Form.Control
                type="text"
                value={formik.values.address}
                onChange={formik.handleChange}
                isInvalid={formik.touched.address && formik.errors.address}
                placeholder="via Paolo, 11, Torino"
              />
              <Form.Control.Feedback type="invalid">{formik.errors.address}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="balance">
              <Form.Label className={'float-sm-start'}>Balance </Form.Label>
              <Form.Control
                  type = "number"
                value={formik.values.balance}
                onChange={formik.handleChange}
                isInvalid={formik.touched.balance && formik.errors.balance}
                placeholder="0.0"
              />
              <Form.Control.Feedback type="invalid">{formik.errors.balance}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="username">
              <Form.Label className={'float-sm-start'}>Username </Form.Label>
              <Form.Control
                type="text"
                value={formik.values.username}
                onChange={formik.handleChange}
                isInvalid={formik.touched.username && formik.errors.username}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.username}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
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
                <Eye />
                <span>show</span>{' '}
              </i>

              <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
            </Form.Group>

            <Row className={'justify-content-between mb-5'}>
              <Col>
                <Link to="/" style={{ textDecoration: 'none' }}>
                  <Button className="btn-danger">Cancel</Button>
                </Link>
              </Col>
              <Col>
                <Button className="btn" type="submit">
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
