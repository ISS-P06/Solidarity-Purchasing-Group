import { useState, useEffect } from "react";
import { Button, Row, Col, Spinner, ListGroup, Card } from 'react-bootstrap/';
import { api_getClientsList } from "../Api";
import ClientOrderForm from "./ClientOrderForm";

function ClientsList(props) {
    const { alert,setAlert, message,setMessage} = props;
    const [clientsList, setClientsList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api_getClientsList()
            .then((result) => {
                const tmp = [];
                for (let client of result) {
                    tmp.push(client)
                }
                setClientsList(tmp);
                setLoading(false);
            })
            .catch((err) => {
                setMessage({ msg: "There are not clients", type: "danger" });
            });

    }, []);

    return (
        loading ?
            <Spinner animation='border' variant='primary' />
            :
            <Col lg="9">
                <h3>Clients List</h3>
                {clientsList.length === 0 ?
                    <h1 className="text-center">There are not clients</h1> :
                    <ListGroup as="ul" variant="flush" className="mt-2">
                        {
                            clientsList.map(c => {
                                return (
                                    <ListGroup.Item as="li" key={c.id}>
                                        <Client client={c}  alert={alert} setAlert={setAlert} message={message}  setMessage={setMessage} />
                                    </ListGroup.Item>
                                );
                            })
                        }
                    </ListGroup>

                }

            </Col>

    );
}


function Client(props) {
    const { client, alert,setAlert, message,setMessage} = props;
    const [clientOrderFormShow, setClientOrderFormShow] = useState(false);

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
                    <Col><Button variant="primary" className="mr-2">Top up wallet</Button></Col>
                    <Col><Button variant="primary" className="mr-2" onClick={() => setClientOrderFormShow(true)}>Add order</Button></Col>


                </Row>
            </Card.Body>
            <ClientOrderForm
                show={clientOrderFormShow}
                onHide={() => setClientOrderFormShow(false)}
                client={client}
                alert={alert} setAlert={setAlert} message={message}  setMessage={setMessage}
            />
        </Card>

    );
}
export default ClientsList;