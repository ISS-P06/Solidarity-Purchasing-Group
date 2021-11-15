import { useState, useEffect } from 'react';

import { Button, Row, Col, Spinner, ListGroup, Card, Modal } from 'react-bootstrap/';
import { api_getClientsList, api_addTopUpClient } from '../../Api';
import ClientOrderForm from './ClientOrderForm';
import ClientTopUpForm from './ClientTopUpForm';

function ClientsList(props) {
  const { setMessage } = props;

  const [clientsList, setClientsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(true);

  useEffect(() => {
    if (dirty) {
      api_getClientsList()
        .then((response) => {
          setClientsList([...response]);
          setLoading(false);
          setDirty(false);
        })
        .catch(() => {
          setMessage({ msg: 'There are no clients', type: 'danger' });
        });
    }
  }, [dirty]);

  return loading ? (
    <Spinner animation="border" variant="primary" />
  ) : (
    <Row>
      <h3 className="mt-3">Clients List</h3>
      {clientsList.length === 0 ? (
        <h1 className="text-center">There are no clients</h1>
      ) : (
        <Row className="justify-content-md-center">
          <Col lg={8} className="pl-5">
            <ListGroup as="ul" variant="flush">
              {clientsList.map((c) => (
                <ListGroup.Item as="li" key={c.id} lg={3}>
                  <Client client={c} setMessage={setMessage} reloadList={() => setDirty(true)} />
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      )}
    </Row>
  );
}

export function Client(props) {
  const { client, setMessage, reloadList } = props;

  const [clientOrderFormShow, setClientOrderFormShow] = useState(false);
  const [clientTopUpFormShow, setClientTopUpFormShow] = useState(false);
  const [confirmationModalShow, setConfirmationModalShow] = useState(false);

  const handleTopUp = (params) => {
    api_addTopUpClient(params)
      .then(() => reloadList())
      .catch(() => {});
  };

  return (
    <Card className="text-left">
      <Card.Header as="h5">{client.name + ' ' + client.surname}</Card.Header>
      <Card.Body>
        <Card.Text>Address: {client.address}</Card.Text>
        <Card.Text>E-mail: {client.mail}</Card.Text>
        <Card.Text>Phone number: {client.phone}</Card.Text>
        <Card.Text>Balance: {client.balance} $</Card.Text>

        <Row>
          <Col>
            <Button variant="primary" className="mr-2" onClick={() => setClientTopUpFormShow(true)}>
              Top up wallet
            </Button>
          </Col>
          <Col>
            <Button variant="primary" className="mr-2" onClick={() => setClientOrderFormShow(true)}>
              Add order
            </Button>
          </Col>
        </Row>
      </Card.Body>
      <ClientOrderForm
        show={clientOrderFormShow}
        onHide={() => setClientOrderFormShow(false)}
        client={client}
        setMessage={setMessage}
        openConfirmationModal={() => setConfirmationModalShow(true)}
      />
      <ClientTopUpForm
        show={clientTopUpFormShow}
        handleClose={() => setClientTopUpFormShow(false)}
        client={client}
        topUpClient={handleTopUp}
        setMessage={setMessage}
      />
      <ConfirmationModal
        show={confirmationModalShow}
        client={client}
        openTopUpForm={() => setClientTopUpFormShow(true)}
        handleClose={() => setConfirmationModalShow(false)}
      />
    </Card>
  );
}

export function ConfirmationModal(props) {
  const { show, openTopUpForm, handleClose, client } = props;

  const handleConfirm = () => {
    handleClose();
    openTopUpForm();
  };

  return (
    <Modal
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Client's balance is low!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Do you want to top up {client.name} {client.surname}'s balance?
      </Modal.Body>

      <Modal.Footer>
        <Button md="auto" onClick={handleConfirm}>
          Top up
        </Button>

        <Button md="auto" variant="danger" onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ClientsList;
