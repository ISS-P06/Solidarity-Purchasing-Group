import 'bootstrap/dist/css/bootstrap.min.css';
import {Form, Modal, Button, Row} from "react-bootstrap"; 
import validator from 'validator';
import {useState} from 'react';
import {Formik} from 'formik';

// --- Renders a modal with "username" and "password" fields to log in
function LoginForm(props) {
    const doLogin = props.doLogin;
    const show = props.show;
    const [errorMessage, setErrorMessage] = useState("");

    const handleClose = () => {
        props.setShow(false);
        setErrorMessage("");
    };
    
    // function used for submitting user data
    const submitData = async function(values) {
        let validUsername = !validator.isEmpty(values.username);
        let validPassword = !validator.isEmpty(values.password) && (values.password.length >= 8);

        if (validUsername && validPassword) {
            const user = {
                username: values.username,
                password: values.password
            };

            let res = await doLogin(user);
            if (res.done)
                handleClose();
            else
                setErrorMessage(res.msg);
        }      
    };

    return (
        <Formik
            onSubmit={(values) => submitData(values)}
            initialValues={{
                username: "",
                password: "",
            }}
            render={
                ({
                    handleSubmit,
                    handleChange,
                    handleBlur,
                    values,
                    errors
                }) => (
                    <Modal
                        show={show}
                        onHide={handleClose}
                        backdrop="static"
                        keyboard={false}
                        >
                        <Modal.Header 
                            className="bg-light text-dark"
                            closeButton>
                            Login
                        </Modal.Header>
                        <Modal.Body
                                className="bg-light text-dark d-flex justify-content-center">
                            <Form
                                noValidate
                                onSubmit={handleSubmit}>
                                <Row>
                                    <Form.Group>
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            required
                                            name="username"
                                            type="text"
                                            value={values.username}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={errors.username || validator.isEmpty(values.username)}
                                            />
                                        <Form.Control.Feedback type="invalid">
                                            Insert a username
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <Form.Group controlId="taskDeadline">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            required
                                            name="password"
                                            type="password"
                                            value={values.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={errors.password
                                                || validator.isEmpty(values.password)
                                                || values.password.length < 8}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {
                                                (values.password.length >= 8 || validator.isEmpty(values.password)) ?
                                                    "Insert a valid password"
                                                    : "Password must be at least 8 characters long"
                                            }
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                <Row>
                                    {
                                        errorMessage === "" ?
                                            <></>
                                            :
                                            <div 
                                                className="text-danger">
                                                    {errorMessage}
                                            </div>
                                    }
                                </Row>
                                <Row
                                    className="d-flex justify-content-center">
                                    <Button 
                                        className="m-2"
                                        variant="info" 
                                        type="submit">
                                        Login
                                    </Button>
                                    <Button 
                                        className="m-2"
                                        variant="secondary" 
                                        onClick={handleClose}>
                                        Cancel
                                    </Button>
                                </Row>
                            </Form>
                        </Modal.Body>                        
                    </Modal>
                )}
                />
    );
}

export default LoginForm;
