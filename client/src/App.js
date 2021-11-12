
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Row } from 'react-bootstrap';
import AppNavbar from './components/AppNavbar';
import ShopEmployeeActionsList from './components/ShopEmployeeActionsList';
import { ClientsList } from './components/ClientsList';
import { useState, useEffect } from 'react';
import AlertBox from './components/Message';

function App() {

  /* for giving feedback to the user*/
  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState(false);


  useEffect(() => {
    if (message !== "") {
      setAlert(true);
    }
  }, [message]);

  return (

    <Container className="App bg-light text-dark p-0 m-0 min-vh-100" fluid>
      <AppNavbar />
      <AlertBox alert={alert} setAlert={setAlert} message={message} />
      <Row>
        <Col className='collapse d-md-block p-0' lg='3' >
          <ShopEmployeeActionsList setMessage={setMessage} />
        </Col>
        <ClientsList setMessage={setMessage} />
      </Row>



    </Container>


  );
}

export default App;
