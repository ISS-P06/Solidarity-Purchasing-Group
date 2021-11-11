import { Navbar, Col } from "react-bootstrap";

// --- Renders the application navbar
function AppNavbar(props) {
  return (
    <Navbar className="bg-primary text-light " fluid="true">
      <Col className="d-flex justify-content-start ms-sm-2">
        <h3>Solidarity Purchasing Group</h3>
      </Col>
    </Navbar>
  );
}

export default AppNavbar;
