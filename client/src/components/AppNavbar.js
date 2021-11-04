import { Navbar, Col } from 'react-bootstrap';


// --- Renders the application navbar
function AppNavbar(props) {
  return (
    <Navbar className="bg-primary text-light" fluid>
      <Col className="d-flex justify-content-start">
        <h3>Solidarity Purchasing Group</h3>
      </Col>
    </Navbar>
  );
}

export default AppNavbar;