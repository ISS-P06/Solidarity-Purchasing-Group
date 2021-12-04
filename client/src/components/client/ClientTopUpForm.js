import { useState } from 'react';
import { Button, Row, Col, Form, FloatingLabel, Modal } from 'react-bootstrap';
import { addMessage } from '../Message';

function ClientTopUpForm(props) {
  const { show, handleClose, client, topUpClient } = props;

  const [amount, setAmount] = useState(5);
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity()) {
      topUpClient({ id: client.id, amount })


      handleClose();
      setAmount(5);
      setValidated(false);
    } else {
      setValidated(true);
    }
  };

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={handleClose}>
      <Form id="topUp" noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Top up {client.name} {client.surname}'s wallet
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="m-2 justify-content-center">
            {/* Column with current amount of balance */}
            <Col xs={6} lg={7}>
              <span>
                <h5>Current balace: </h5>
                <h4>€ {client.balance.toFixed(2)} </h4>
              </span>
            </Col>

            {/* Calumn for add to the balance */}
            <Col>
              <FloatingLabel controlId="TopUp" label="Insert top up" className="mt-2 mb-4" required>
                <Form.Control
                  type="number"
                  placeholder="Amount"
                  step={5}
                  min={5}
                  onChange={(e) => setAmount(e.target.value)}
                  defaultValue={amount}
                  isInvalid={amount < 5}
                />
                <Form.Control.Feedback type="invalid">
                  Please insert a valid amount more then €5
                </Form.Control.Feedback>
              </FloatingLabel>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn" md="auto" type="submit">
            Confirm
          </Button>

          <Button md="auto" variant="danger" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ClientTopUpForm;
