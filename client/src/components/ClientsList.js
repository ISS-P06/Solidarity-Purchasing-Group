import { useState, useEffect } from "react";

import { Button, Row, Col, Spinner, ListGroup, Card } from 'react-bootstrap/';
import { api_getClientsList, api_addTopUpClient } from "../Api";
import {ClientOrderForm} from "./ClientOrderForm";
import ClientTopUpForm from "./ClientTopUpForm";
function ClientsList(props) {
  const { handleToggleSidebar, handleCollapsedChange, setMessage } = props;
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
          setMessage({ msg: "There are not clients", type: "danger" });
        });
    }
  }, [dirty]);


  return (
    loading ?
      <Spinner animation='border' variant='primary' />
      :
      <Col lg="9"  className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
        <h3>Clients List</h3>
        {clientsList.length === 0 ?
          <h1 className="text-center">There are not clients</h1> :
          <ListGroup as="ul" variant="flush" className="mt-2">
          <Row>
          {
            clientsList.map(c => {
              return (
                <ListGroup.Item as="li" key={c.id} lg={3}>
                  <Client client={c} setMessage={setMessage} reloadList={() => setDirty(true)} />
                </ListGroup.Item>
              );
            })
          }
          </Row>
    
          </ListGroup>

        }

      </Col>

  );
}

function Client(props) {

  const { client, setMessage,reloadList} = props;
  const [clientOrderFormShow, setClientOrderFormShow] = useState(false);
  const [clientTopUpFormShow, setClientTopUpFormShow] = useState(false);

  const handleTopUp = (params) => {
    api_addTopUpClient(params).then(() => reloadList());
  };


  return (
    <Card className="text-left">
      <Card.Header as="h5">{client.name + " " + client.surname}</Card.Header>
      <Card.Body>
        <Card.Text>
          Address: {client.address}
        </Card.Text>

        <Card.Text>
          E-mail: {client.mail}
        </Card.Text>

        <Card.Text>
          Phone number: {client.phone}
        </Card.Text>

        <Card.Text>
          Balance: {client.balance} $
        </Card.Text>

        <Row>
          <Col><Button variant="primary" className="mr-2" onClick={() => setClientTopUpFormShow(true)}>Top up wallet</Button></Col>
          <Col><Button variant="primary" className="mr-2" onClick={() => setClientOrderFormShow(true)}>Add order</Button></Col>


        </Row>
      </Card.Body>
      <ClientOrderForm
        show={clientOrderFormShow}
        onHide={() => setClientOrderFormShow(false)}
        client={client}
        setMessage={setMessage}
      />
      <ClientTopUpForm
        show={clientTopUpFormShow}
        handleClose={() => setClientTopUpFormShow(false)}
        client={client}
        topUpClient={handleTopUp}
      />
    </Card>

  );
}
export { ClientsList, Client }