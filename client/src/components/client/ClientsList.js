import { useState, useEffect } from 'react';
import { Button, Row, Col, Spinner, Card, Modal, Container } from 'react-bootstrap/';
import { api_getClientsList, api_addTopUpClient } from '../../Api';
import ClientOrderForm from './ClientOrderForm';
import ClientTopUpForm from './ClientTopUpForm';
import { addMessage } from '../Message';
import { checkOrderInterval } from '../../utils/date.js';

function ClientsList(props) {
  const virtualTime = props.virtualTime;

  const [clientsList, setClientsList] = useState([]); /* clientsList stores the list of clients*/
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
        .catch((error) => {
          addMessage({ message: error.message, type: 'danger' });
        });
    }
  }, [dirty]);

  return loading ? (
    <Spinner animation="border" variant="primary" />
  ) : (
    <Container>
      <h3 className="mt-3">Clients List</h3>
      {clientsList.length === 0 ? (
        <h1 className="text-center">There are no clients</h1>
      ) : (
        <Row className="justify-content-md-center">
          <Col lg={8} className="pl-5">
            <div as="ul" variant="flush">
              {clientsList.map((c) => (
                <div as="li" className="mt-1 mb-4" key={c.id} lg={3}>
                  <Client client={c} virtualTime={virtualTime} reloadList={() => setDirty(true)} />
                </div>
              ))}
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export function Client(props) {
  const { client, reloadList, virtualTime } = props;

  const [clientOrderFormShow, setClientOrderFormShow] = useState(false); /* used for open clientOrderForm modal*/
  const [clientTopUpFormShow, setClientTopUpFormShow] = useState(false); /* used for open clientTopUpForm modal*/
  const [confirmationModalShow, setConfirmationModalShow] = useState(false); /* used for open confirmartion modal*/

  const handleTopUp = (params) => {
    api_addTopUpClient(params)
      .then(() => reloadList())
      .catch(() => {});
  };

  return (
    <Card className="text-left shadow">
      <Card.Header as="h5">{client.name + ' ' + client.surname}</Card.Header>
      <Card.Body>
        <Card.Text>Address: {client.address}</Card.Text>
        <Card.Text>E-mail: {client.mail}</Card.Text>
        <Card.Text>Phone number: {client.phone}</Card.Text>
        <Card.Text>Balance: {client.balance} €</Card.Text>

        <Row>
          <Col>
            <Button className="btn mr-2" onClick={() => setClientTopUpFormShow(true)}>
              Top up wallet
            </Button>
          </Col>
          <Col>
            {checkOrderInterval(virtualTime) ? (
              <Button className="btn mr-2" onClick={() => setClientOrderFormShow(true)}>
                Add order
              </Button>
            ) : (
              <Button className="btn mr-2 " onClick={() => setClientOrderFormShow(true)} disabled>
                Add order
              </Button>
            )}
          </Col>
        </Row>
        {checkOrderInterval(virtualTime) ? (
          <></>
        ) : (
          <Row className="p-1 d-flex justify-content-center">
            Sorry, but orders are accepted only from Sat. 9am until Sun. 11pm.
          </Row>
        )}
      </Card.Body>
      <ClientOrderForm
        show={clientOrderFormShow}
        onHide={() => setClientOrderFormShow(false)}
        client={client}
        openConfirmationModal={() => setConfirmationModalShow(true)}
      />
      <ClientTopUpForm
        show={clientTopUpFormShow}
        handleClose={() => setClientTopUpFormShow(false)}
        client={client}
        topUpClient={handleTopUp}
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
        <Button className="btn" md="auto" onClick={handleConfirm}>
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
