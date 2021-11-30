import { Button, Col, Image, Row, Container } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

{
  /*Pixabay License*/
}

function ClientHomePage(props) {
  const { user } = props;
  const history = useHistory();

  const img = '/img/client/vegetables-g380a038fb_640.jpg';
  const orderImg = '/img/client/space-4967335_1280.png';

  return (
    <Container>
      <h1 className="mt-3 mb-3" style={{ color: '#27511D' }}>
        Welcome on Solidarity Purchase Group, {user && user.name} {user && user.surname}!
      </h1>
      <h4 className="mt-3 mb-3">Your current balance is {user && user.balance} €</h4>
      {/*Todo update with the real balance*/}
      <h3 className="pt-5">What would you like to do?</h3>
      <h4 className="pb-5"> Choose one of the options below by clicking on the images! </h4>
      <Row className="justify-content-center pt-2">
        <Col xs={12} lg={6} className="ml-auto">
          <Container>
            <Row>
              <Col className="polaroid justify-content-center p-0">
                <Button
                  style={{ background: '#fff' }}
                  onClick={() => history.push('/client/products')}>
                  <Image src={img} style={{ width: '100%', paddingTop: '20px' }}></Image>
                  <Row class="containerImage">
                    <h3>Add products to my basket</h3>
                  </Row>
                </Button>
              </Col>
              <Col className="polaroid justify-content-center p-0">
                <Button
                  style={{ background: '#fff' }}
                  onClick={() => {
                    history.push('/client/orders');
                  }}>
                  <Image src={orderImg} style={{ width: '100%', paddingTop: '20px' }}></Image>
                  <Row class="containerImage">
                    <h3>Browse my order history list</h3>
                  </Row>
                </Button>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

export default ClientHomePage;
