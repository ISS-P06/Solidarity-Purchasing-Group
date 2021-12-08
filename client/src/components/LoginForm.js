import { Form, Col, Button, Row, Container } from 'react-bootstrap';
import validator from 'validator';
import { useState } from 'react';
import { Formik } from 'formik';
import { BiUserCircle } from 'react-icons/bi';

// --- Renders a modal with "username" and "password" fields to log in
function LoginForm(props) {
  // doLogin function, passed as a prop from App.js
  // this function calls the login api and logs the user in
  // if the request is successful
  const doLogin = props.doLogin;

  // State used to render error messages
  const [errorMessage, setErrorMessage] = useState('');

  // function used for submitting user data
  const submitData = async function (values) {
    // We use validator to make sure the fields are not empty
    // and that the password has an acceptable length
    const validUsername = !validator.isEmpty(values.username);
    const validPassword = !validator.isEmpty(values.password) && values.password.length >= 8;

    // If both username and password are ok, submit data
    if (validUsername && validPassword) {
      const user = {
        username: values.username,
        password: values.password,
      };

      // Se doLogin function above for details
      const res = await doLogin(user);
      if (res.done && res.role) {
        return;
      }
      else 
        // sets an error message in case the request goes wrong
        setErrorMessage(res.msg);
    }
  };

  return (
    <>
    {/* Formik is used to handle the form itself, validation and data submission */}
    <Formik
      onSubmit={(values) => submitData(values)}
      initialValues={{
        username: '',
        password: '',
      }}>
      {({ handleSubmit, handleChange, handleBlur, values, errors, touched }) => (
        <Container>
          <Row>
            <BiUserCircle size="80" />
          </Row>
          <Row>
            <h3>Log in</h3>
          </Row>
          <Row className="d-flex justify-content-center">
            <Col xs={2} lg={4} />
            <Col xs={8} lg={4}>
              <Form noValidate onSubmit={handleSubmit}>
                <Row>
                  <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      required
                      name="username"
                      type="text"
                      placeholder="Username"
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={
                        touched.username && (errors.username || validator.isEmpty(values.username))
                      }
                    />
                    <Form.Control.Feedback type="invalid">Insert a username</Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group controlId="taskDeadline">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      required
                      name="password"
                      type="password"
                      placeholder="Password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={
                        touched.password &&
                        (errors.password ||
                          validator.isEmpty(values.password) ||
                          values.password.length < 8)
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {values.password.length >= 8 || validator.isEmpty(values.password)
                        ? 'Insert a valid password'
                        : 'Password must be at least 8 characters long'}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row>
                  {errorMessage === '' ? <></> : <div className="text-danger">{errorMessage}</div>}
                </Row>
                <Col>
                  <Button className="btn mt-2" md="auto" variant="info" type="submit">
                    Login
                  </Button>
                </Col>
              </Form>
            </Col>
            <Col xs={2} lg={4} />
          </Row>
        </Container>
      )}
    </Formik>
    </>
  );
}

export default LoginForm;
